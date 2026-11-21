import torch
import torch.nn as nn
from typing import Tuple, List, Dict, Any
import numpy as np

class LSTMDemandForecaster(nn.Module):
    """
    Multi-horizon LSTM Recurrent Neural Network for SKU demand forecasting.
    Input shape: (batch_size, seq_len, input_dim)
    Output shape: (batch_size, 3) representing [forecast_7d, forecast_30d, forecast_90d]
    """
    def __init__(self, input_dim: int = 4, hidden_dim: int = 64, num_layers: int = 2, dropout: float = 0.2):
        super().__init__()
        self.input_dim = input_dim
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers

        self.lstm = nn.LSTM(
            input_size=input_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0.0
        )

        self.fc_head = nn.Sequential(
            nn.Linear(hidden_dim, 32),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(32, 3)  # [7d, 30d, 90d]
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: (batch_size, seq_len, input_dim)
        lstm_out, _ = self.lstm(x)
        last_hidden = lstm_out[:, -1, :]
        out = self.fc_head(last_hidden)
        # Demand units cannot be negative
        return torch.relu(out)

    def train_forecaster(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
        epochs: int = 30,
        lr: float = 0.005,
        batch_size: int = 8
    ) -> Dict[str, Any]:
        """Runs optimization loop with Adam optimizer and MSE loss."""
        self.train()
        optimizer = torch.optim.Adam(self.parameters(), lr=lr, weight_decay=1e-4)
        criterion = nn.MSELoss()

        X_tensor = torch.tensor(X_train, dtype=torch.float32)
        y_tensor = torch.tensor(y_train, dtype=torch.float32)

        losses = []
        n_samples = len(X_train)

        for epoch in range(epochs):
            indices = np.random.permutation(n_samples)
            epoch_loss = 0.0
            batches = 0

            for i in range(0, n_samples, batch_size):
                batch_idx = indices[i:i + batch_size]
                batch_x = X_tensor[batch_idx]
                batch_y = y_tensor[batch_idx]

                optimizer.zero_grad()
                pred = self.forward(batch_x)
                loss = criterion(pred, batch_y)
                loss.backward()
                optimizer.step()

                epoch_loss += loss.item()
                batches += 1

            avg_loss = epoch_loss / max(batches, 1)
            losses.append(avg_loss)

        self.eval()
        with torch.no_grad():
            preds = self.forward(X_tensor).numpy()
            mape = float(np.mean(np.abs((y_train - preds) / np.maximum(y_train, 1.0))))
            rmse = float(np.sqrt(np.mean((y_train - preds) ** 2)))

        return {
            "final_loss": round(losses[-1], 4),
            "mape": round(mape, 4),
            "rmse": round(rmse, 2),
            "accuracy_pct": round(max(0.0, 1.0 - mape) * 100, 1),
            "epochs_completed": epochs
        }
