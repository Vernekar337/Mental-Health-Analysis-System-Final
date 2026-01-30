import logging
import sys
import os

def setup_logger(name: str = "ml_service"):
    logger = logging.getLogger(name)
    
    # Check if logger is already configured to avoid duplicate logs
    if not logger.handlers:
        logger.setLevel(os.getenv("LOG_LEVEL", "INFO"))
        
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
    return logger

logger = setup_logger()
