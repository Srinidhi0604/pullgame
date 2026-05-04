import { bioChemPapers } from "./bioPapers";
import { domainPapers } from "./domainPapers";

export type Difficulty = "easy" | "medium" | "hard";
export type PaperTrack = "ml" | "biology" | "chemistry" | "electrical" | "electronics";

export interface PaperVisual {
  variant:
    | "deepchem"
    | "benchmark"
    | "molecule"
    | "protein"
    | "generative"
    | "genomics"
    | "single-cell"
    | "cell"
    | "structure"
    | "phylogeny"
    | "chemistry"
    | "chemistry-3d"
    | "docking"
    | "reaction"
    | "power"
    | "signals"
    | "machines"
    | "logic"
    | "analog"
    | "cmos"
    | "layout"
    | "memory";
  caption: string;
  tools?: { label: string; href: string }[];
}

export interface Task {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  skeleton: string;
  tests: string;
  solveCount: number;
}

export interface Paper {
  slug: string;
  title: string;
  year: number;
  authors: string[];
  tags: string[];
  description: string;
  tasks: Task[];
  track?: PaperTrack;
  sourceUrl?: string;
  repositoryUrl?: string;
  visual?: PaperVisual;
}

export const papers: Paper[] = [
  {
    slug: "attention-is-all-you-need",
    title: "Attention Is All You Need",
    year: 2017,
    authors: ["Vaswani", "Shazeer", "Parmar", "et al."],
    tags: ["NLP", "Transformer", "Attention"],
    description:
      "The Transformer architecture replacing recurrence with self-attention mechanisms, enabling parallel training and achieving state-of-the-art results in machine translation.",
    sourceUrl: "https://arxiv.org/pdf/1706.03762.pdf",
    tasks: [
      {
        slug: "scaled-dot-product-attention",
        title: "Scaled Dot-Product Attention",
        difficulty: "medium",
        category: "Micro",
        solveCount: 342,
        description: `# Scaled Dot-Product Attention

## Problem Description

After understanding the core building block of the Transformer, implement the Scaled Dot-Product Attention mechanism from scratch.

The attention function computes a weighted sum of values (V) where the weights are determined by the compatibility of queries (Q) with keys (K).

## The Mechanism

\`\`\`
Attention(Q, K, V) = softmax(Q·Kᵀ / √d_k) · V
\`\`\`

### Steps:
1. Compute **Q·Kᵀ** — the raw attention scores
2. **Scale** by dividing by √d_k to prevent large dot products
3. (Optional) Apply a **mask** for causal attention
4. Apply **softmax** to obtain attention weights
5. Multiply by **V** to get the weighted output

## Mathematical Formulation

Given queries Q of shape (seq_q, d_k), keys K of shape (seq_k, d_k), and values V of shape (seq_k, d_v):

\`\`\`
scores = Q · Kᵀ / √d_k
weights = softmax(scores, axis=-1)
output = weights · V
\`\`\`

Where:
- The scaling factor √d_k prevents the dot products from growing too large
- Softmax is applied row-wise to normalize attention weights
- The output has shape (seq_q, d_v)`,
        skeleton: `import numpy as np

def scaled_dot_product_attention(q: np.ndarray, k: np.ndarray, v: np.ndarray, mask: np.ndarray = None) -> np.ndarray:
    """
    Compute Scaled Dot-Product Attention.

    Args:
        q: Query matrix of shape (..., seq_len_q, d_k)
        k: Key matrix of shape (..., seq_len_k, d_k)
        v: Value matrix of shape (..., seq_len_k, d_v)
        mask: Optional mask of shape (..., seq_len_q, seq_len_k)

    Returns:
        output: Attention output of shape (..., seq_len_q, d_v)
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_scaled_dot_product_attention():
    np.random.seed(42)
    q = np.random.randn(2, 4, 8)
    k = np.random.randn(2, 6, 8)
    v = np.random.randn(2, 6, 16)

    output = scaled_dot_product_attention(q, k, v)

    assert output.shape == (2, 4, 16), f"Expected shape (2, 4, 16), got {output.shape}"

    d_k = q.shape[-1]
    scores = q @ k.transpose(0, 2, 1) / np.sqrt(d_k)
    weights = np.exp(scores) / np.exp(scores).sum(axis=-1, keepdims=True)
    expected = weights @ v
    np.testing.assert_allclose(output, expected, rtol=1e-5)

    print("All tests passed!")`,
      },
      {
        slug: "positional-encoding",
        title: "Sinusoidal Positional Encoding",
        difficulty: "easy",
        category: "Micro",
        solveCount: 487,
        description: `# Sinusoidal Positional Encoding

## Problem Description

Since the Transformer has no recurrence or convolution, it needs positional information injected into the input embeddings. The original paper uses fixed sinusoidal functions.

## The Formula

\`\`\`
PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
\`\`\`

Where \`pos\` is the position and \`i\` is the dimension index.

## Mathematical Formulation

For each position pos in [0, seq_len) and dimension i in [0, d_model/2):
- Even dimensions: sin(pos / 10000^(2i/d_model))
- Odd dimensions: cos(pos / 10000^(2i/d_model))

This creates unique, deterministic encodings that allow the model to learn relative positions.`,
        skeleton: `import numpy as np

def positional_encoding(seq_len: int, d_model: int) -> np.ndarray:
    """
    Generate sinusoidal positional encodings.

    Args:
        seq_len: Length of the sequence
        d_model: Dimension of the model (must be even)

    Returns:
        Positional encoding matrix of shape (seq_len, d_model)
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_positional_encoding():
    pe = positional_encoding(50, 64)

    assert pe.shape == (50, 64)
    assert pe.min() >= -1.0 and pe.max() <= 1.0
    np.testing.assert_allclose(pe[0, 0], 0.0, atol=1e-7)

    print("All tests passed!")`,
      },
      {
        slug: "multi-head-attention",
        title: "Multi-Head Attention",
        difficulty: "hard",
        category: "Micro",
        solveCount: 156,
        description: `# Multi-Head Attention

## Problem Description

Instead of performing a single attention function, Multi-Head Attention runs multiple attention heads in parallel, each with different learned linear projections.

## The Mechanism

\`\`\`
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) · W_O
where head_i = Attention(Q·W_Q_i, K·W_K_i, V·W_V_i)
\`\`\`

Each head operates on a d_k = d_model/h dimensional subspace.

## Your Task

Implement the full Multi-Head Attention mechanism including:
- Linear projections for Q, K, V
- Splitting into multiple heads
- Scaled dot-product attention per head
- Concatenation and output projection`,
        skeleton: `import numpy as np

class MultiHeadAttention:
    def __init__(self, d_model: int, num_heads: int):
        """
        Args:
            d_model: Model dimension
            num_heads: Number of attention heads
        """
        # YOUR CODE HERE - initialize weight matrices
        raise NotImplementedError

    def forward(self, q: np.ndarray, k: np.ndarray, v: np.ndarray, mask=None) -> np.ndarray:
        """
        Args:
            q: Queries of shape (batch, seq_len, d_model)
            k: Keys of shape (batch, seq_len, d_model)
            v: Values of shape (batch, seq_len, d_model)

        Returns:
            Output of shape (batch, seq_len, d_model)
        """
        # YOUR CODE HERE
        raise NotImplementedError`,
        tests: `import numpy as np

def test_multi_head_attention():
    np.random.seed(42)
    mha = MultiHeadAttention(d_model=64, num_heads=8)

    q = np.random.randn(2, 10, 64)
    k = np.random.randn(2, 10, 64)
    v = np.random.randn(2, 10, 64)

    output = mha.forward(q, k, v)
    assert output.shape == (2, 10, 64), f"Expected (2, 10, 64), got {output.shape}"

    print("All tests passed!")`,
      },
      {
        slug: "transformer-encoder",
        title: "Transformer Encoder Block",
        difficulty: "hard",
        category: "Micro",
        solveCount: 98,
        description: `# Transformer Encoder Block

## Problem Description

The Transformer Encoder consists of two sub-layers: Multi-Head Self-Attention and a Position-wise Feed-Forward Network, each followed by residual connections and layer normalization.

## Architecture

\`\`\`
x → MultiHeadAttention(x, x, x) → Add & LayerNorm → FFN → Add & LayerNorm → output
\`\`\`

The FFN consists of two linear transformations with a ReLU activation:
\`\`\`
FFN(x) = max(0, x·W₁ + b₁)·W₂ + b₂
\`\`\`

## Your Task

Implement a complete Transformer Encoder block combining self-attention, FFN, residual connections, and layer normalization.`,
        skeleton: `import numpy as np

class TransformerEncoderBlock:
    def __init__(self, d_model: int, num_heads: int, d_ff: int):
        """
        Args:
            d_model: Model dimension
            num_heads: Number of attention heads
            d_ff: Feed-forward hidden dimension
        """
        # YOUR CODE HERE
        raise NotImplementedError

    def forward(self, x: np.ndarray, mask=None) -> np.ndarray:
        """
        Args:
            x: Input of shape (batch, seq_len, d_model)
        Returns:
            Output of shape (batch, seq_len, d_model)
        """
        # YOUR CODE HERE
        raise NotImplementedError`,
        tests: `import numpy as np

def test_transformer_encoder():
    np.random.seed(42)
    encoder = TransformerEncoderBlock(d_model=64, num_heads=8, d_ff=256)
    x = np.random.randn(2, 10, 64)

    output = encoder.forward(x)
    assert output.shape == (2, 10, 64)

    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "batch-normalization",
    title: "Batch Normalization: Accelerating Deep Network Training",
    year: 2015,
    authors: ["Ioffe", "Szegedy"],
    tags: ["Deep Learning", "Optimization", "Normalization"],
    description:
      "Addresses the problem of internal covariate shift by normalizing each mini-batch, enabling higher learning rates and reducing the dependence on careful initialization.",
    sourceUrl: "https://arxiv.org/pdf/1502.03167.pdf",
    tasks: [
      {
        slug: "batch-norm-forward",
        title: "Batch Normalization Forward",
        difficulty: "medium",
        category: "Micro",
        solveCount: 398,
        description: `# Batch Normalization

## Problem Description

Batch Normalization (Ioffe & Szegedy, 2015) normalizes each mini-batch to address internal covariate shift.

## The Math (Training Mode)

\`\`\`
μ_B = (1/m) Σ x_i
σ²_B = (1/m) Σ (x_i - μ_B)²
x̂_i = (x_i - μ_B) / √(σ²_B + ε)
y_i = γ · x̂_i + β
\`\`\`

During inference, running statistics (exponential moving average) are used instead of batch statistics.

## Your Task

Implement BatchNorm with both training and inference modes, including running mean/variance tracking.`,
        skeleton: `import numpy as np

class BatchNorm:
    def __init__(self, num_features: int, eps: float = 1e-5, momentum: float = 0.1):
        self.gamma = np.ones(num_features)
        self.beta = np.zeros(num_features)
        self.running_mean = np.zeros(num_features)
        self.running_var = np.ones(num_features)
        self.eps = eps
        self.momentum = momentum

    def forward(self, x: np.ndarray, training: bool = True) -> np.ndarray:
        """
        Args:
            x: Input of shape (batch_size, num_features)
            training: Whether in training mode
        Returns:
            Normalized output of shape (batch_size, num_features)
        """
        # YOUR CODE HERE
        raise NotImplementedError`,
        tests: `import numpy as np

def test_batch_norm():
    np.random.seed(42)
    bn = BatchNorm(num_features=8)
    x = np.random.randn(32, 8) * 5 + 3

    out_train = bn.forward(x, training=True)
    assert out_train.shape == x.shape
    np.testing.assert_allclose(out_train.mean(axis=0), 0, atol=1e-6)

    print("All tests passed!")`,
      },
      {
        slug: "batch-norm-backward",
        title: "Batch Normalization Backward",
        difficulty: "hard",
        category: "Micro",
        solveCount: 185,
        description: `# Batch Normalization Backward Pass

## Problem Description

The backward pass of Batch Normalization requires computing the gradients of the loss with respect to the input \`x\`, as well as the learnable parameters \`gamma\` and \`beta\`.

## The Math

Because the mean and variance depend on the entire batch of inputs, the gradient \`dx\` has terms coming from the direct path, the mean path, and the variance path.

## Your Task

Implement the analytical backward pass for Batch Normalization.`,
        skeleton: `import numpy as np

def batch_norm_backward(dout: np.ndarray, cache: dict) -> tuple:
    """
    Args:
        dout: Upstream derivatives of shape (batch, features)
        cache: Dictionary containing 'x_hat', 'gamma', 'var', 'eps', 'x_mu' from forward pass
    Returns:
        dx, dgamma, dbeta
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_batch_norm_backward():
    dout = np.random.randn(32, 8)
    cache = {
        'x_hat': np.random.randn(32, 8),
        'gamma': np.ones(8),
        'var': np.ones(8),
        'eps': 1e-5,
        'x_mu': np.random.randn(32, 8)
    }
    try:
        dx, dgamma, dbeta = batch_norm_backward(dout, cache)
    except NotImplementedError:
        pass # Handle placeholder
    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "adam-optimizer",
    title: "Adam: A Method for Stochastic Optimization",
    year: 2015,
    authors: ["Kingma", "Ba"],
    tags: ["Optimization", "Deep Learning"],
    description:
      "Adaptive moment estimation optimizer combining benefits of RMSProp and momentum, computing individual adaptive learning rates for different parameters.",
    sourceUrl: "https://arxiv.org/pdf/1412.6980.pdf",
    tasks: [
      {
        slug: "adam-step",
        title: "Adam Optimizer Step",
        difficulty: "medium",
        category: "Micro",
        solveCount: 275,
        description: `# Adam Optimizer

## Problem Description

Adam combines the benefits of AdaGrad (per-parameter learning rates) and RMSProp (moving average of squared gradients) with bias correction.

## The Algorithm

\`\`\`
m_t = β₁ · m_{t-1} + (1 - β₁) · g_t
v_t = β₂ · v_{t-1} + (1 - β₂) · g_t²
m̂_t = m_t / (1 - β₁ᵗ)
v̂_t = v_t / (1 - β₂ᵗ)
θ_t = θ_{t-1} - α · m̂_t / (√v̂_t + ε)
\`\`\`

## Your Task

Implement the Adam optimizer step function that updates parameters given gradients.`,
        skeleton: `import numpy as np

class Adam:
    def __init__(self, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8):
        self.lr = lr
        self.beta1 = beta1
        self.beta2 = beta2
        self.eps = eps
        self.m = None
        self.v = None
        self.t = 0

    def step(self, params: np.ndarray, grads: np.ndarray) -> np.ndarray:
        """
        Perform one Adam update step.
        Args:
            params: Current parameters
            grads: Gradients w.r.t. parameters
        Returns:
            Updated parameters
        """
        # YOUR CODE HERE
        raise NotImplementedError`,
        tests: `import numpy as np

def test_adam():
    np.random.seed(42)
    adam = Adam(lr=0.01)
    params = np.array([1.0, 2.0, 3.0])
    grads = np.array([0.1, -0.2, 0.3])

    new_params = adam.step(params, grads)
    assert new_params.shape == params.shape
    assert not np.allclose(new_params, params)

    print("All tests passed!")`,
      },
      {
        slug: "adamw-optimizer",
        title: "AdamW: Decoupled Weight Decay",
        difficulty: "hard",
        category: "Micro",
        solveCount: 142,
        description: `# AdamW Optimizer

## Problem Description

The original Adam optimizer implemented weight decay in a way that was coupled with the gradient updates, which led to suboptimal generalization. AdamW (Loshchilov & Hutter, 2017) decouples weight decay from the gradient update.

## The Algorithm

\`\`\`
m_t = β₁ · m_{t-1} + (1 - β₁) · g_t
v_t = β₂ · v_{t-1} + (1 - β₂) · g_t²
m̂_t = m_t / (1 - β₁ᵗ)
v̂_t = v_t / (1 - β₂ᵗ)
θ_t = θ_{t-1} - α · (m̂_t / (√v̂_t + ε) + λ · θ_{t-1})
\`\`\`

## Your Task

Implement the AdamW optimizer step.`,
        skeleton: `import numpy as np

class AdamW:
    def __init__(self, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8, weight_decay=0.01):
        self.lr = lr
        self.beta1 = beta1
        self.beta2 = beta2
        self.eps = eps
        self.weight_decay = weight_decay
        self.m = None
        self.v = None
        self.t = 0

    def step(self, params: np.ndarray, grads: np.ndarray) -> np.ndarray:
        # YOUR CODE HERE
        raise NotImplementedError`,
        tests: `import numpy as np

def test_adamw():
    np.random.seed(42)
    adamw = AdamW(lr=0.01, weight_decay=0.1)
    params = np.array([1.0, 2.0, 3.0])
    grads = np.array([0.1, -0.2, 0.3])
    
    try:
        new_params = adamw.step(params, grads)
        assert new_params.shape == params.shape
        assert not np.allclose(new_params, params)
    except NotImplementedError:
        pass
        
    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "dropout-regularization",
    title: "Dropout: Preventing Neural Network Overfitting",
    year: 2014,
    authors: ["Srivastava", "Hinton", "Krizhevsky", "et al."],
    tags: ["Regularization", "Deep Learning"],
    description:
      "A simple yet powerful regularization technique that randomly zeroes elements during training, preventing co-adaptation of neurons and improving generalization.",
    sourceUrl: "https://jmlr.org/papers/volume15/srivastava14a/srivastava14a.pdf",
    tasks: [
      {
        slug: "inverted-dropout",
        title: "Inverted Dropout",
        difficulty: "easy",
        category: "Micro",
        solveCount: 612,
        description: `# Dropout

## Problem Description

Dropout (Srivastava et al., 2014) is a regularization technique that randomly zeroes elements during training.

## The Mechanism

During **training**: Each element is independently set to zero with probability p, and the remaining elements are scaled by 1/(1-p) (inverted dropout).

During **inference**: No dropout is applied; the output equals the input.

## Your Task

Implement inverted dropout with both training and inference modes.`,
        skeleton: `import numpy as np

def dropout(x: np.ndarray, p: float = 0.5, training: bool = True) -> np.ndarray:
    """
    Apply inverted dropout.
    Args:
        x: Input tensor
        p: Probability of dropping an element
        training: Whether in training mode
    Returns:
        Output with dropout applied (same shape as x)
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_dropout():
    np.random.seed(42)
    x = np.ones((1000, 100))

    out = dropout(x, p=0.5, training=True)
    assert out.shape == x.shape
    zero_frac = (out == 0).mean()
    assert 0.4 < zero_frac < 0.6, f"Expected ~50% zeros, got {zero_frac:.2%}"

    out_eval = dropout(x, p=0.5, training=False)
    np.testing.assert_array_equal(out_eval, x)

    print("All tests passed!")`,
      },
      {
        slug: "dropout-backward",
        title: "Dropout Backward Pass",
        difficulty: "medium",
        category: "Micro",
        solveCount: 420,
        description: `# Dropout Backward Pass

## Problem Description

During backpropagation, the gradients must flow only through the elements that were kept during the forward pass, scaled by the same factor (1/(1-p)).

## Your Task

Implement the backward pass of inverted dropout given the dropout mask from the forward pass and the upstream gradients.`,
        skeleton: `import numpy as np

def dropout_backward(dout: np.ndarray, mask: np.ndarray, p: float = 0.5) -> np.ndarray:
    """
    Args:
        dout: Upstream gradients of shape (batch_size, features)
        mask: Boolean mask used in forward pass (True for dropped, False for kept)
        p: Dropout probability
    Returns:
        Gradients with respect to input
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_dropout_backward():
    dout = np.ones((100, 10))
    mask = np.random.rand(100, 10) < 0.5
    
    try:
        dx = dropout_backward(dout, mask, p=0.5)
        assert dx.shape == dout.shape
        assert np.all(dx[mask] == 0)
        assert np.allclose(dx[~mask], 2.0)
    except NotImplementedError:
        pass
        
    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "layer-normalization",
    title: "Layer Normalization",
    year: 2016,
    authors: ["Ba", "Kiros", "Hinton"],
    tags: ["Deep Learning", "Normalization"],
    description:
      "Normalizes activations across the feature dimension for each individual sample, unlike Batch Normalization which normalizes across the batch. Essential in Transformers.",
    sourceUrl: "https://arxiv.org/pdf/1607.06450.pdf",
    tasks: [
      {
        slug: "layer-norm-forward",
        title: "Layer Normalization Forward",
        difficulty: "easy",
        category: "Micro",
        solveCount: 521,
        description: `# Layer Normalization

## Problem Description

Layer Normalization (Ba et al., 2016) normalizes activations across the feature dimension for each individual sample.

## The Math

\`\`\`
μ = mean(x, axis=-1)
σ² = var(x, axis=-1)
x̂ = (x - μ) / √(σ² + ε)
y = γ · x̂ + β
\`\`\`

Where γ (gain) and β (bias) are learnable parameters.

## Your Task

Implement the forward pass of Layer Normalization from scratch.`,
        skeleton: `import numpy as np

def layer_norm(x: np.ndarray, gamma: np.ndarray, beta: np.ndarray, eps: float = 1e-5) -> np.ndarray:
    """
    Apply Layer Normalization.
    Args:
        x: Input of shape (batch_size, features)
        gamma: Scale parameter of shape (features,)
        beta: Shift parameter of shape (features,)
        eps: Small constant for numerical stability
    Returns:
        Normalized output of shape (batch_size, features)
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_layer_norm():
    np.random.seed(42)
    x = np.random.randn(4, 8)
    gamma = np.ones(8)
    beta = np.zeros(8)

    output = layer_norm(x, gamma, beta)

    assert output.shape == x.shape
    np.testing.assert_allclose(output.mean(axis=-1), 0, atol=1e-6)
    np.testing.assert_allclose(output.std(axis=-1), 1, atol=0.1)

    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "cross-entropy",
    title: "Cross Entropy Loss",
    year: 1948,
    authors: ["Shannon"],
    tags: ["Foundational", "Information Theory"],
    description:
      "Cross-entropy measures the difference between two probability distributions. It is the standard loss function for classification tasks in deep learning.",
    sourceUrl: "https://ieeexplore.ieee.org/document/6773024",
    tasks: [
      {
        slug: "cross-entropy-loss",
        title: "Cross Entropy from Logits",
        difficulty: "easy",
        category: "Micro",
        solveCount: 589,
        description: `# Cross Entropy Loss

## Problem Description

Cross-entropy measures the difference between two probability distributions and is the standard loss function for classification tasks.

## The Formula

For a single sample with true class y and predicted probabilities p:
\`\`\`
L = -log(p[y])
\`\`\`

For a batch, average over all samples. You must first apply softmax to convert logits to probabilities.

## Your Task

Implement cross-entropy loss from logits (including the softmax step) with numerical stability.`,
        skeleton: `import numpy as np

def cross_entropy_loss(logits: np.ndarray, targets: np.ndarray) -> float:
    """
    Compute cross-entropy loss from logits.
    Args:
        logits: Raw scores of shape (batch_size, num_classes)
        targets: Integer class labels of shape (batch_size,)
    Returns:
        Scalar loss value
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_cross_entropy():
    logits = np.array([[10.0, 0.0, 0.0], [0.0, 10.0, 0.0]])
    targets = np.array([0, 1])
    loss = cross_entropy_loss(logits, targets)
    assert loss < 0.01, f"Perfect prediction loss too high: {loss}"

    logits_random = np.zeros((2, 3))
    loss_random = cross_entropy_loss(logits_random, targets)
    assert loss_random > 1.0

    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "backpropagation",
    title: "Learning Representations by Back-Propagating Errors",
    year: 1986,
    authors: ["Rumelhart", "Hinton", "Williams"],
    tags: ["Foundational", "Neural Networks"],
    description:
      "The cornerstone algorithm for training neural networks, using the chain rule to compute gradients of the loss with respect to each parameter through automatic differentiation.",
    sourceUrl: "https://www.nature.com/articles/323533a0.pdf",
    tasks: [
      {
        slug: "backprop-mlp",
        title: "Backpropagation Through MLP",
        difficulty: "medium",
        category: "Micro",
        solveCount: 231,
        description: `# Backpropagation Through MLP

## Problem Description

Backpropagation uses the chain rule to compute gradients of the loss with respect to each parameter.

## The Setup

A simple 2-layer MLP:
\`\`\`
z₁ = x · W₁ + b₁
a₁ = ReLU(z₁)
z₂ = a₁ · W₂ + b₂
loss = MSE(z₂, y)
\`\`\`

## Your Task

Implement the full forward and backward pass, computing gradients for W₁, b₁, W₂, b₂.`,
        skeleton: `import numpy as np

class MLP:
    def __init__(self, input_dim: int, hidden_dim: int, output_dim: int):
        self.W1 = np.random.randn(input_dim, hidden_dim) * 0.01
        self.b1 = np.zeros(hidden_dim)
        self.W2 = np.random.randn(hidden_dim, output_dim) * 0.01
        self.b2 = np.zeros(output_dim)

    def forward(self, x: np.ndarray) -> np.ndarray:
        """Forward pass. Store intermediates for backward."""
        # YOUR CODE HERE
        raise NotImplementedError

    def backward(self, x: np.ndarray, y: np.ndarray) -> dict:
        """
        Compute gradients via backpropagation.
        Returns:
            Dictionary with keys 'dW1', 'db1', 'dW2', 'db2'
        """
        # YOUR CODE HERE
        raise NotImplementedError`,
        tests: `import numpy as np

def test_backprop():
    np.random.seed(42)
    mlp = MLP(input_dim=4, hidden_dim=8, output_dim=2)
    x = np.random.randn(16, 4)
    y = np.random.randn(16, 2)

    out = mlp.forward(x)
    assert out.shape == (16, 2)

    grads = mlp.backward(x, y)
    assert grads['dW1'].shape == (4, 8)
    assert grads['dW2'].shape == (8, 2)

    print("All tests passed!")`,
      },
    ],
  },
  ...bioChemPapers,
  ...domainPapers,
];

export const difficultyConfig = {
  easy: { label: "Easy", color: "#10b981", weight: 1 },
  medium: { label: "Medium", color: "#f59e0b", weight: 2 },
  hard: { label: "Hard", color: "#ef4444", weight: 3 },
};

// Tag colors for the filter chips
export const tagColors: Record<string, string> = {
  "NLP": "#8b5cf6",
  "Transformer": "#6366f1",
  "Attention": "#3b82f6",
  "Deep Learning": "#06b6d4",
  "Optimization": "#14b8a6",
  "Normalization": "#10b981",
  "Regularization": "#22c55e",
  "Foundational": "#f59e0b",
  "Neural Networks": "#f97316",
  "Information Theory": "#ef4444",
  "ML": "#ec4899",
  "Classification": "#d946ef",
  "Kernel Methods": "#a855f7",
  "Biology": "#22c55e",
  "Chemistry": "#06b6d4",
  "DeepChem": "#14b8a6",
  "MoleculeNet": "#0ea5e9",
  "GraphConv": "#8b5cf6",
  "Drug Discovery": "#f43f5e",
  "Visualization": "#f59e0b",
  "Generative Models": "#ec4899",
  "Protein Ligand": "#a3e635",
  "Electrical Learning": "#38bdf8",
  "Electronics Learning": "#f97316",
  "Power Systems": "#0ea5e9",
  "Signals": "#22c55e",
  "Control": "#eab308",
  "Digital Logic": "#f43f5e",
  "CMOS": "#8b5cf6",
  "Analog": "#06b6d4",
  "VLSI": "#a855f7",
  "RISC-V": "#ef4444",
};

// Helper to find a paper by slug
export function getPaperBySlug(slug: string): Paper | undefined {
  return papers.find((p) => p.slug === slug);
}

// Helper to find a task within a paper
export function getTaskBySlug(paperSlug: string, taskSlug: string): { paper: Paper; task: Task } | undefined {
  const paper = getPaperBySlug(paperSlug);
  if (!paper) return undefined;
  const task = paper.tasks.find((t) => t.slug === taskSlug);
  if (!task) return undefined;
  return { paper, task };
}

// Get all unique tags
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  papers.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}
