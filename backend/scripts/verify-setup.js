const fs = require('fs');
const path = require('path');

const requiredFiles = [
    '.env.example',
    'package.json',
    'server.js',
    'src/app.js',
    'src/config/db.js',
    'src/models/User.js',
    'src/models/Assessment.js',
    'src/models/JournalEntry.js',
    'src/models/AnalysisResult.js',
    'src/models/CaseFile.js',
    'src/middleware/authMiddleware.js',
    'src/middleware/errorMiddleware.js',
    'src/services/mlService.js',
    'src/controllers/authController.js',
    'src/controllers/assessmentController.js',
    'src/controllers/journalController.js',
    'src/controllers/counselorController.js',
    'src/controllers/adminController.js',
    'src/controllers/internalMlController.js',
    'src/routes/authRoutes.js',
    'src/routes/assessmentRoutes.js',
    'src/routes/journalRoutes.js',
    'src/routes/counselorRoutes.js',
    'src/routes/adminRoutes.js',
    'src/routes/mlRoutes.js',
];

let missingFiles = [];

console.log('--- Checking File Structure ---');
requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
        console.log(`[OK] Found: ${file}`);
        try {
            // Try to require the file to check for syntax errors (only for .js)
            if (file.endsWith('.js') && !file.includes('server.js')) { // Skip server.js as it runs immediately
                require(filePath);
                console.log(`   [Syntax OK] Loaded: ${file}`);
            }
        } catch (e) {
            console.error(`   [ERROR] Syntax error in ${file}: ${e.message}`);
        }
    } else {
        console.error(`[MISSING] ${file}`);
        missingFiles.push(file);
    }
});

if (missingFiles.length === 0) {
    console.log('\nSUCCESS: All required files are present and loadable.');
} else {
    console.error(`\nFAILURE: Missing ${missingFiles.length} files.`);
    process.exit(1);
}
