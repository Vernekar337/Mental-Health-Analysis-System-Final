import numpy as np
from sklearn.cluster import KMeans
from app.utils.logger import logger

# Constants
DEFAULT_N_CLUSTERS = 3
CLUSTER_EXPLANATIONS = {
    0: "Cluster 0: Group with distinct pattern A", # Placeholder explanations as we don't have labeled data
    1: "Cluster 1: Group with distinct pattern B",
    2: "Cluster 2: Group with distinct pattern C"
}

def cluster_risk_logic(feature_vectors: list[list[float]]) -> dict:
    """
    Performs KMeans clustering on the provided feature vectors.
    Note: Since this is stateless, we fit on the *provided* batch.
    This identifies relative clusters within the input group.
    
    If the goal was to predict cluster of a single user against a trained model, 
    we would need a persisted model. As per 'Stateless' constraint, we cluster the input batch.
    
    Wait, the API says:
    Input: { "feature_vectors": [[float]] }
    Output: { "cluster_id": int, "cluster_explanation": string }
    
    The output schema implies a single cluster ID return, possibly for the *last* vector or specific one?
    Or maybe the input is a batch and we return the cluster for a specific user?
    
    However, usually 'Cluster Risk' implies assigning a user to a risk group.
    Without a pre-trained model, we can't assign a meaningful global risk ID (like 0=Low, 1=High) uniquely 
    unless we hardcode thresholds or have reference points.
    
    Given "Stateless" and "No model files", I will assume we are clustering the BATCH and returning 
    logic for the *first* or *last* element? Or maybe the request is for a single user but to be stateless 
    we can't do anything other than heuristic grouping?
    
    Let's interpret: "Input: feature_vectors" (plural). "Output: cluster_id" (singular).
    This suggests the input might contain reference vectors + the user vector, OR we cluster the batch and return the ID of the specific user of interest?
    
    Actually, simpler interpretation:
    Since we cannot train, utilize a pre-defined set of centroids if possible?
    Or: Fit KMeans on the input batch (assuming it's a history or a populations) and return the cluster of the most recent entry.
    
    Let's go with: Fit on input batch, return cluster of the last vector.
    """
    try:
        data = np.array(feature_vectors)
        
        # If too few samples for k-means, handle gracefully
        n_samples = data.shape[0]
        n_clusters = min(DEFAULT_N_CLUSTERS, n_samples)
        
        if n_samples < 1:
             raise ValueError("No data for clustering")

        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        kmeans.fit(data)
        
        # Return cluster of the LAST vector in the list
        labels = kmeans.labels_
        target_cluster_id = int(labels[-1])
        
        explanation = f"Assigned to local cluster {target_cluster_id} based on provided batch distribution."
        
        logger.info(f"Clustering performed on {n_samples} samples. Target assigned to {target_cluster_id}.")
        
        return {
            "cluster_id": target_cluster_id,
            "cluster_explanation": explanation
        }
        
    except Exception as e:
        logger.error(f"Error in clustering: {str(e)}")
        raise e
