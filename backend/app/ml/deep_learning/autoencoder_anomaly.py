import torch
import torch.nn as nn
from typing import Dict, Any, List, Tuple
import numpy as np

class DeepAnomalyAutoencoder(nn.Module):
    r"""
    Deep Autoencoder with bottleneck compression for unsupervised transaction & margin anomaly detection.
    Computes reconstruction error: ||x - \hat{x}||^2.
    """
    def __init__(self, input_dim: int = 4, latent_dim: int = 2):
        super().__init__()
        self.input_dim = input_dim
        self.latent_dim = latent_dim

        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 16),
            nn.LeakyReLU(0.2),
            nn.Linear(16, 8),
            nn.LeakyReLU(0.2),
            nn.Linear(8, latent_dim)
        )

        self.decoder = nn.Sequential(
            nn.Linear(latent_dim, 8),
            nn.LeakyReLU(0.2),
            nn.Linear(8, 16),
            nn.LeakyReLU(0.2),
            nn.Linear(16, input_dim)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        latent = self.encoder(x)
        reconstructed = self.decoder(latent)
        return reconstructed

    def compute_reconstruction_error(self, x: torch.Tensor) -> np.ndarray:
        self.eval()
        with torch.no_grad():
            reconstructed = self.forward(x)
            mse_per_sample = torch.mean((x - reconstructed) ** 2, dim=1)
            return mse_per_sample.cpu().numpy()

    def train_autoencoder(
        self,
        X_train: np.ndarray,
        epochs: int = 40,
        lr: float = 0.005,
        batch_size: int = 8
    ) -> Dict[str, Any]:
        """Trains autoencoder to reconstruct normal baseline patterns."""
        self.train()
        optimizer = torch.optim.Adam(self.parameters(), lr=lr, weight_decay=1e-4)
        criterion = nn.MSELoss()

        X_tensor = torch.tensor(X_train, dtype=torch.float32)
        n_samples = len(X_train)
        losses = []

        for epoch in range(epochs):
            indices = np.random.permutation(n_samples)
            epoch_loss = 0.0
            batches = 0

            for i in range(0, n_samples, batch_size):
                batch_idx = indices[i:i + batch_size]
                batch_x = X_tensor[batch_idx]

                optimizer.zero_grad()
                reconstructed = self.forward(batch_x)
                loss = criterion(reconstructed, batch_x)
                loss.backward()
                optimizer.step()

                epoch_loss += loss.item()
                batches += 1

            losses.append(epoch_loss / max(batches, 1))

        # Dynamic outlier threshold calculated at 90th percentile of baseline reconstruction error
        recon_errors = self.compute_reconstruction_error(X_tensor)
        threshold = float(np.percentile(recon_errors, 90))

        return {
            "final_reconstruction_loss": round(float(losses[-1]), 4),
            "anomaly_threshold": round(threshold, 4),
            "mean_error": round(float(np.mean(recon_errors)), 4),
            "epochs_completed": epochs
        }
