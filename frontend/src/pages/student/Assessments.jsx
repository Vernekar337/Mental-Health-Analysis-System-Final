import React, { useState } from 'react';
import { ASSESSMENTS } from '../../util/assessmentData';
import { ClipboardList, ChevronRight, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { submitAssessment } from '../../services/api';

const TYPE_MAP = {
  "PHQ-9": "PHQ9",
  "GAD-7": "GAD7",
  "DASS-21": "DASS21"
};

const Assessments = () => {
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSelectAssessment = (key) => {
    setSelectedAssessment(key);
    setCurrentStep(0);
    setResponses({});
    setCompleted(false);
  };

  const handleOptionSelect = (score) => {
    setResponses(prev => ({
      ...prev,
      [currentStep]: score
    }));

    // Auto advance after short delay for better UX
    setTimeout(() => {
      if (currentStep < ASSESSMENTS[selectedAssessment].questions.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }, 200);
  };

  const handleNext = () => {
    if (currentStep < ASSESSMENTS[selectedAssessment].questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {

    setIsSubmitting(true);

    try {

      const payload = {
        assessmentType: TYPE_MAP[selectedAssessment],
        responses: Object.keys(responses)
          .sort((a, b) => a - b)
          .map(k => responses[k])
      };

      console.log("Submitting Payload:", payload);

      await submitAssessment(payload);

      setCompleted(true);

    }
    catch (err) {

      console.error("Submission error:", err);

      alert("Failed to submit assessment");

    }
    finally {

      setIsSubmitting(false);

    }

  };

  const resetSelection = () => {
    setSelectedAssessment(null);
    setCompleted(false);
  };

  // --- RENDER: Selection View ---
  if (!selectedAssessment) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mental Health Assessments</h1>
          <p className="text-slate-500 mt-1">Select an assessment to begin. Your responses are confidential.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(ASSESSMENTS).map(([key, data]) => (
            <div key={key} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group" onClick={() => handleSelectAssessment(key)}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${key === 'PHQ-9' || key === 'GAD-7' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                  <ClipboardList className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 border border-slate-200 px-2 py-1 rounded">{data.frequency}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">{data.title}</h3>
              <p className="text-slate-600 mb-4">{data.description}</p>
              <div className="flex items-center text-emerald-600 font-medium text-sm">
                Start Assessment <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- RENDER: Success View ---
  if (completed) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-6">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Assessment Submitted</h2>
        <p className="text-slate-600 mb-8">Thank you for completing the check-in. Your responses have been securely recorded.</p>
        <button onClick={resetSelection} className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors">
          Return to Assessments
        </button>
      </div>
    );
  }

  // --- RENDER: Taking Assessment View ---
  const data = ASSESSMENTS[selectedAssessment];
  const totalQuestions = data.questions.length;
  const progress = ((currentStep + 1) / totalQuestions) * 100;
  const isLastQuestion = currentStep === totalQuestions - 1;
  const canSubmit = isLastQuestion && responses[currentStep] !== undefined;

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={resetSelection} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Selection
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 w-full">
          <div className="h-full bg-emerald-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="p-8 md:p-12">
          <div className="mb-8">
            <span className="text-emerald-600 font-semibold tracking-wide text-sm uppercase mb-2 block">{data.title}</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-4">
              {data.questions[currentStep]}
            </h2>
            <p className="text-slate-500 italic border-l-4 border-slate-200 pl-4 py-1">
              {data.instructions}
            </p>
          </div>

          <div className="space-y-3">
            {data.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between group ${responses[currentStep] === option.value
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                  : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-700'
                  }`}
              >
                <span className="font-medium text-lg">{option.label}</span>
                {responses[currentStep] === option.value && <CheckCircle className="w-5 h-5 text-emerald-600" />}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded text-slate-500 font-medium ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-100 hover:text-slate-800'}`}
            >
              Previous
            </button>

            <div className="text-slate-400 text-sm font-medium">
              Question {currentStep + 1} of {totalQuestions}
            </div>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={responses[currentStep] === undefined || isSubmitting}
                className={`px-6 py-2 rounded-lg font-bold text-white transition-all ${responses[currentStep] === undefined || isSubmitting
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-md transform hover:-translate-y-0.5'
                  }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={responses[currentStep] === undefined}
                className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all ${responses[currentStep] === undefined
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
              >
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessments;
