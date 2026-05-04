import type { Paper } from "./papers";

export const bioChemPapers: Paper[] = [
  {
    slug: "deepchem-basic-tools-life-sciences",
    title: "DeepChem: The Basic Tools of the Deep Life Sciences",
    year: 2021,
    authors: ["Ramsundar", "DeepChem"],
    tags: ["Biology", "Chemistry", "DeepChem", "MoleculeNet", "GraphConv", "Drug Discovery", "Visualization"],
    track: "chemistry",
    sourceUrl: "https://deepchem.io/tutorials/the-basic-tools-of-the-deep-life-sciences/",
    repositoryUrl: "https://github.com/deepchem/deepchem",
    visual: {
      variant: "deepchem",
      caption: "A compact DeepChem workflow: MoleculeNet data, molecular graph featurization, GraphConv training, evaluation, and prediction visualization.",
      tools: [
        { label: "DeepChem", href: "https://github.com/deepchem/deepchem" },
        { label: "PyMolAI reference", href: "https://github.com/ravishar313/PyMolAI" },
      ],
    },
    description:
      "A hands-on implementation track based on DeepChem's introductory tutorial. Build the same life-sciences workflow in small tested steps: load Delaney solubility data, featurize molecules as graphs, run graph convolution updates, evaluate Pearson R2, predict new molecules, and create molecule graph layouts for visualization.",
    tasks: [
      {
        slug: "delaney-dataset-split",
        title: "Delaney Dataset Split",
        difficulty: "easy",
        category: "DeepChem",
        solveCount: 91,
        description: `# Delaney Dataset Split

## Problem Description

The DeepChem tutorial begins with MoleculeNet's Delaney solubility dataset and returns train, validation, and test splits. Implement a tiny DeepChem-like loader for records that contain SMILES strings and measured log solubility.

## Your Task

Create load_delaney_like(records, fractions, seed). It should return:
- tasks: ["log_solubility"]
- datasets: a tuple of train, valid, test dictionaries
- transformers: a list naming the label transform used by this toy loader

Each dataset dictionary should contain ids, y, and records. The y array must have shape (n, 1).`,
        skeleton: `import numpy as np

def load_delaney_like(records, fractions=(0.8, 0.1, 0.1), seed=0):
    """
    Build deterministic train/valid/test splits for solubility records.

    Args:
        records: list of dictionaries with keys "smiles" and "log_solubility"
        fractions: train, valid, test fractions that sum to 1
        seed: random seed used for shuffling

    Returns:
        tasks, (train_dataset, valid_dataset, test_dataset), transformers
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_delaney_dataset_split():
    records = [
        {"smiles": "CCO", "log_solubility": -0.3},
        {"smiles": "CCN", "log_solubility": -0.5},
        {"smiles": "CCC", "log_solubility": -1.1},
        {"smiles": "CCCl", "log_solubility": -1.5},
        {"smiles": "CCBr", "log_solubility": -1.8},
        {"smiles": "COC", "log_solubility": -0.7},
        {"smiles": "NCCO", "log_solubility": 0.1},
        {"smiles": "CCS", "log_solubility": -1.2},
        {"smiles": "CNC", "log_solubility": -0.2},
        {"smiles": "OCCO", "log_solubility": 0.4},
    ]

    tasks, datasets, transformers = load_delaney_like(records, seed=7)
    train, valid, test = datasets

    assert tasks == ["log_solubility"]
    assert transformers == ["identity"]
    assert len(train["ids"]) == 8
    assert len(valid["ids"]) == 1
    assert len(test["ids"]) == 1
    assert train["y"].shape == (8, 1)

    again = load_delaney_like(records, seed=7)[1][0]["ids"]
    assert list(train["ids"]) == list(again)

    all_ids = set(train["ids"]) | set(valid["ids"]) | set(test["ids"])
    assert all_ids == {r["smiles"] for r in records}

    print("All tests passed!")`,
      },
      {
        slug: "molecular-graph-featurizer",
        title: "Molecular Graph Featurizer",
        difficulty: "medium",
        category: "DeepChem",
        solveCount: 84,
        description: `# Molecular Graph Featurizer

## Problem Description

DeepChem's tutorial uses the GraphConv featurizer. Build a simplified molecular graph featurizer that turns a small SMILES string into atom features and a bond adjacency matrix.

## Your Task

Implement featurize_smiles(smiles). It should tokenize common atom symbols, one-hot encode atoms with ATOM_VOCAB, and connect consecutive atoms with undirected single bonds. This is not a full chemistry parser; it is a small implementation step for learning graph features.`,
        skeleton: `import numpy as np

ATOM_VOCAB = ["C", "N", "O", "S", "F", "Cl", "Br"]

def featurize_smiles(smiles):
    """
    Convert a simple SMILES string into atom features and adjacency.

    Returns:
        dict with keys "atoms", "X", and "A"
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_molecular_graph_featurizer():
    graph = featurize_smiles("CCO")
    assert graph["atoms"] == ["C", "C", "O"]
    assert graph["X"].shape == (3, len(ATOM_VOCAB))
    assert graph["A"].shape == (3, 3)
    assert graph["A"][0, 1] == 1 and graph["A"][1, 0] == 1
    assert graph["A"][1, 2] == 1 and graph["A"][2, 1] == 1
    assert graph["A"][0, 2] == 0
    np.testing.assert_array_equal(graph["X"][0], np.array([1, 0, 0, 0, 0, 0, 0]))
    np.testing.assert_array_equal(graph["X"][2], np.array([0, 0, 1, 0, 0, 0, 0]))

    halogen = featurize_smiles("ClCCBr")
    assert halogen["atoms"] == ["Cl", "C", "C", "Br"]
    assert halogen["A"].sum() == 6

    print("All tests passed!")`,
      },
      {
        slug: "graphconv-message-passing",
        title: "GraphConv Message Passing",
        difficulty: "medium",
        category: "GraphConv",
        solveCount: 77,
        description: `# GraphConv Message Passing

## Problem Description

Graph convolutional models update each atom by mixing its current features with neighboring atom features. Implement one normalized message-passing step.

## Formula

\`\`\`
A_self = A + I
H = D^-1 A_self X W + b
\`\`\`

Use row normalization so each atom averages over itself and its neighbors.`,
        skeleton: `import numpy as np

def graph_conv_step(atom_features, adjacency, weight, bias=None):
    """
    Apply one row-normalized graph convolution step.

    Args:
        atom_features: X with shape (n_atoms, in_features)
        adjacency: A with shape (n_atoms, n_atoms)
        weight: W with shape (in_features, out_features)
        bias: optional vector with shape (out_features,)

    Returns:
        Updated atom features with shape (n_atoms, out_features)
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_graphconv_message_passing():
    X = np.array([[1.0, 0.0], [0.0, 2.0], [3.0, 0.0]])
    A = np.array([[0, 1, 0], [1, 0, 1], [0, 1, 0]], dtype=float)
    W = np.eye(2)

    out = graph_conv_step(X, A, W)
    expected = np.array([
        [0.5, 1.0],
        [4.0 / 3.0, 2.0 / 3.0],
        [1.5, 1.0],
    ])
    np.testing.assert_allclose(out, expected)

    bias = np.array([0.25, -0.5])
    shifted = graph_conv_step(X, A, W, bias=bias)
    np.testing.assert_allclose(shifted, expected + bias)

    print("All tests passed!")`,
      },
      {
        slug: "pearson-r2-evaluation",
        title: "Pearson R2 Evaluation",
        difficulty: "easy",
        category: "Metrics",
        solveCount: 102,
        description: `# Pearson R2 Evaluation

## Problem Description

The DeepChem tutorial evaluates the solubility model with Pearson R2 on both training and test splits. Implement the metric and a small split evaluator.

## Your Task

pearson_r2_score should return the squared Pearson correlation between labels and predictions. If either vector has zero variance, return 0.0.`,
        skeleton: `import numpy as np

def pearson_r2_score(y_true, y_pred):
    """
    Compute squared Pearson correlation.
    """
    # YOUR CODE HERE
    raise NotImplementedError

def evaluate_solubility_split(train_y, train_pred, test_y, test_pred):
    """
    Return train and test Pearson R2 scores in a dictionary.
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_pearson_r2_evaluation():
    y = np.array([1.0, 2.0, 3.0, 4.0])
    assert abs(pearson_r2_score(y, y) - 1.0) < 1e-8
    assert abs(pearson_r2_score(y, -y) - 1.0) < 1e-8
    assert pearson_r2_score(y, np.ones_like(y)) == 0.0

    scores = evaluate_solubility_split(
        np.array([[1.0], [2.0], [3.0]]),
        np.array([[1.1], [1.9], [3.2]]),
        np.array([[0.0], [2.0]]),
        np.array([[0.2], [1.8]]),
    )
    assert set(scores) == {"train_pearson_r2", "test_pearson_r2"}
    assert 0.0 <= scores["train_pearson_r2"] <= 1.0
    assert 0.0 <= scores["test_pearson_r2"] <= 1.0

    print("All tests passed!")`,
      },
      {
        slug: "solubility-batch-prediction",
        title: "Solubility Batch Prediction",
        difficulty: "medium",
        category: "DeepChem",
        solveCount: 69,
        description: `# Solubility Batch Prediction

## Problem Description

The tutorial finishes by calling predict_on_batch for the first molecules in the test set. Implement a tiny batch predictor that maps molecular feature vectors to log solubility predictions and ranks molecules by predicted solubility.

## Your Task

Use a linear readout with optional label unnormalization:

\`\`\`
prediction = features @ weights + bias
log_solubility = prediction * std + mean
\`\`\``,
        skeleton: `import numpy as np

def predict_on_batch(features, weights, bias=0.0, mean=0.0, std=1.0):
    """
    Predict log solubility values for a batch of molecules.
    """
    # YOUR CODE HERE
    raise NotImplementedError

def rank_by_prediction(ids, predictions, top_k=3):
    """
    Return the top_k ids sorted from highest to lowest predicted value.
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_solubility_batch_prediction():
    features = np.array([
        [1.0, 0.0, 2.0],
        [0.0, 1.0, 1.0],
        [2.0, 1.0, 0.0],
    ])
    weights = np.array([0.5, -0.25, 0.1])
    preds = predict_on_batch(features, weights, bias=0.2, mean=-1.0, std=2.0)

    assert preds.shape == (3, 1)
    expected_raw = features @ weights + 0.2
    np.testing.assert_allclose(preds[:, 0], expected_raw * 2.0 - 1.0)

    ids = ["CCO", "CCC", "NCCO"]
    ranking = rank_by_prediction(ids, preds, top_k=2)
    assert ranking == ["NCCO", "CCO"]

    print("All tests passed!")`,
      },
      {
        slug: "molecule-graph-layout",
        title: "Molecule Graph Layout",
        difficulty: "easy",
        category: "Visualization",
        solveCount: 88,
        description: `# Molecule Graph Layout

## Problem Description

Molecular tooling such as PyMOL and PyMolAI focuses on making atom-level structures visible and inspectable. Build the small geometry helper that a paper visualization panel can use for 2D molecule graphs.

## Your Task

Implement layout_molecule(adjacency, radius) with circular coordinates, and graph_edges(adjacency) to list undirected bonds.`,
        skeleton: `import numpy as np

def layout_molecule(adjacency, radius=1.0):
    """
    Place atoms evenly on a circle for simple molecule visualization.
    """
    # YOUR CODE HERE
    raise NotImplementedError

def graph_edges(adjacency):
    """
    Return undirected edges (i, j) where i < j and adjacency[i, j] is nonzero.
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_molecule_graph_layout():
    A = np.array([
        [0, 1, 0, 1],
        [1, 0, 1, 0],
        [0, 1, 0, 1],
        [1, 0, 1, 0],
    ])
    coords = layout_molecule(A, radius=2.0)
    assert coords.shape == (4, 2)
    radii = np.sqrt((coords ** 2).sum(axis=1))
    np.testing.assert_allclose(radii, np.full(4, 2.0))

    edges = graph_edges(A)
    assert edges == [(0, 1), (0, 3), (1, 2), (2, 3)]

    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "moleculenet-benchmark",
    title: "MoleculeNet: A Benchmark for Molecular Machine Learning",
    year: 2018,
    authors: ["Wu", "Ramsundar", "Feinberg", "et al."],
    tags: ["Biology", "Chemistry", "MoleculeNet", "DeepChem", "Benchmarking", "Drug Discovery"],
    track: "chemistry",
    sourceUrl: "https://pubs.rsc.org/en/content/articlehtml/2018/sc/c7sc02664a",
    repositoryUrl: "https://github.com/deepchem/deepchem",
    visual: {
      variant: "benchmark",
      caption: "A benchmark matrix for datasets, featurizers, models, metrics, and split protocols.",
      tools: [{ label: "DeepChem", href: "https://github.com/deepchem/deepchem" }],
    },
    description:
      "MoleculeNet standardizes molecular machine learning evaluation across public datasets, featurizers, splits, and metrics. This track turns the benchmark protocol into small coding tasks.",
    tasks: [
      {
        slug: "masked-multitask-accuracy",
        title: "Masked Multitask Accuracy",
        difficulty: "easy",
        category: "Metrics",
        solveCount: 73,
        description: `# Masked Multitask Accuracy

## Problem Description

Molecular datasets often have missing labels for some tasks. Implement a masked metric that ignores unknown labels and reports per-task accuracy plus a mean score.`,
        skeleton: `import numpy as np

def masked_task_accuracy(y_true, y_pred, weights):
    """
    Compute per-task binary accuracy while ignoring entries with weight 0.
    y_pred contains probabilities.
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_masked_multitask_accuracy():
    y_true = np.array([[1, 0, 1], [0, 1, 1], [1, 1, 0]])
    y_pred = np.array([[0.9, 0.2, 0.4], [0.4, 0.6, 0.8], [0.7, 0.1, 0.3]])
    weights = np.array([[1, 1, 0], [1, 1, 1], [1, 0, 1]])

    scores = masked_task_accuracy(y_true, y_pred, weights)
    assert set(scores) == {"task_0", "task_1", "task_2", "mean"}
    assert abs(scores["task_0"] - 1.0) < 1e-8
    assert abs(scores["task_1"] - 1.0) < 1e-8
    assert abs(scores["task_2"] - 0.5) < 1e-8
    assert abs(scores["mean"] - (1.0 + 1.0 + 0.5) / 3) < 1e-8

    print("All tests passed!")`,
      },
      {
        slug: "scaffold-holdout-split",
        title: "Scaffold Holdout Split",
        difficulty: "medium",
        category: "Dataset",
        solveCount: 61,
        description: `# Scaffold Holdout Split

## Problem Description

MoleculeNet emphasizes split quality. A scaffold split keeps structurally related molecules together so the test set better measures chemical generalization.

## Your Task

Group records by their scaffold key and assign whole scaffold groups to train, validation, and test sets.`,
        skeleton: `def scaffold_split(records, train_frac=0.8, valid_frac=0.1):
    """
    Split records by scaffold without placing one scaffold in multiple splits.
    Each record has a "scaffold" key.
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_scaffold_holdout_split():
    records = [
        {"smiles": "a1", "scaffold": "A"},
        {"smiles": "a2", "scaffold": "A"},
        {"smiles": "b1", "scaffold": "B"},
        {"smiles": "b2", "scaffold": "B"},
        {"smiles": "c1", "scaffold": "C"},
        {"smiles": "d1", "scaffold": "D"},
        {"smiles": "e1", "scaffold": "E"},
        {"smiles": "f1", "scaffold": "F"},
        {"smiles": "g1", "scaffold": "G"},
        {"smiles": "h1", "scaffold": "H"},
    ]

    train, valid, test = scaffold_split(records, train_frac=0.6, valid_frac=0.2)

    def scaffolds(split):
        return {r["scaffold"] for r in split}

    assert len(train) >= 6
    assert scaffolds(train).isdisjoint(scaffolds(valid))
    assert scaffolds(train).isdisjoint(scaffolds(test))
    assert scaffolds(valid).isdisjoint(scaffolds(test))
    assert sorted(r["smiles"] for r in train + valid + test) == sorted(r["smiles"] for r in records)

    print("All tests passed!")`,
      },
      {
        slug: "benchmark-leaderboard-summary",
        title: "Benchmark Leaderboard Summary",
        difficulty: "easy",
        category: "Benchmarking",
        solveCount: 57,
        description: `# Benchmark Leaderboard Summary

## Problem Description

Benchmarks become useful when results are comparable. Implement a small summarizer that identifies the best model for every dataset and returns a sorted leaderboard.`,
        skeleton: `def summarize_regression_scores(rows):
    """
    rows: list of dicts with keys dataset, model, and pearson_r2

    Returns:
        sorted_rows, best_by_dataset
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_benchmark_leaderboard_summary():
    rows = [
        {"dataset": "delaney", "model": "rf", "pearson_r2": 0.61},
        {"dataset": "delaney", "model": "graphconv", "pearson_r2": 0.69},
        {"dataset": "qm9", "model": "graphconv", "pearson_r2": 0.72},
        {"dataset": "qm9", "model": "weave", "pearson_r2": 0.75},
    ]

    sorted_rows, best = summarize_regression_scores(rows)
    assert sorted_rows[0]["model"] == "weave"
    assert best["delaney"]["model"] == "graphconv"
    assert best["qm9"]["pearson_r2"] == 0.75
    assert rows[0]["model"] == "rf"

    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "molecular-neural-fingerprints",
    title: "Convolutional Networks on Graphs for Learning Molecular Fingerprints",
    year: 2015,
    authors: ["Duvenaud", "Maclaurin", "Aguilera-Iparraguirre", "et al."],
    tags: ["Chemistry", "GraphConv", "Molecular Fingerprints", "Drug Discovery", "Representation Learning"],
    track: "chemistry",
    sourceUrl: "https://arxiv.org/abs/1509.09292",
    visual: {
      variant: "molecule",
      caption: "A molecule graph becomes an interpretable learned fingerprint by repeatedly pooling atom neighborhoods.",
    },
    description:
      "This paper generalizes circular molecular fingerprints with differentiable graph convolutions. The implementation track focuses on neighborhoods, graph updates, fingerprints, and atom-level contribution visualizations.",
    tasks: [
      {
        slug: "circular-neighborhoods",
        title: "Circular Neighborhoods",
        difficulty: "easy",
        category: "GraphConv",
        solveCount: 66,
        description: `# Circular Neighborhoods

## Problem Description

Classic molecular fingerprints collect atom neighborhoods at increasing radii. Implement the neighborhood expansion that graph neural fingerprints learn from.`,
        skeleton: `def circular_neighborhoods(adjacency, radius):
    """
    Return a list of sets. Entry i contains nodes within radius hops of atom i,
    including atom i itself.
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_circular_neighborhoods():
    A = np.array([[0, 1, 0, 0], [1, 0, 1, 0], [0, 1, 0, 1], [0, 0, 1, 0]])
    r1 = circular_neighborhoods(A, radius=1)
    assert r1 == [{0, 1}, {0, 1, 2}, {1, 2, 3}, {2, 3}]

    r2 = circular_neighborhoods(A, radius=2)
    assert r2[0] == {0, 1, 2}
    assert r2[1] == {0, 1, 2, 3}

    print("All tests passed!")`,
      },
      {
        slug: "neural-fingerprint-pooling",
        title: "Neural Fingerprint Pooling",
        difficulty: "medium",
        category: "Representation Learning",
        solveCount: 52,
        description: `# Neural Fingerprint Pooling

## Problem Description

Implement a tiny differentiable fingerprint: apply graph updates, ReLU activations, and sum-pool atom states into one fixed-size molecule vector.`,
        skeleton: `import numpy as np

def neural_fingerprint(atom_features, adjacency, weights):
    """
    Apply one graph update per weight matrix and sum-pool atom states.
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_neural_fingerprint_pooling():
    X = np.array([[1.0, 0.0], [0.0, 1.0]])
    A = np.array([[0, 1], [1, 0]], dtype=float)
    weights = [np.eye(2), np.array([[1.0, 2.0], [0.5, 1.0]])]

    fp = neural_fingerprint(X, A, weights)
    assert fp.shape == (2,)
    assert np.all(fp >= 0)

    # With two connected atoms and identity first update, both atom states match.
    one_step = neural_fingerprint(X, A, [np.eye(2)])
    np.testing.assert_allclose(one_step, np.array([1.0, 1.0]))

    print("All tests passed!")`,
      },
      {
        slug: "atom-contribution-scores",
        title: "Atom Contribution Scores",
        difficulty: "easy",
        category: "Visualization",
        solveCount: 49,
        description: `# Atom Contribution Scores

## Problem Description

Learned fingerprints can be inspected by scoring each atom's contribution to a property readout. Implement a simple dot-product scorer for visualization overlays.`,
        skeleton: `import numpy as np

def atom_contribution_scores(atom_features, readout_weights):
    """
    Return one scalar contribution per atom.
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_atom_contribution_scores():
    X = np.array([[1.0, 0.0, 0.5], [0.0, 1.0, 0.2], [0.5, 0.5, 1.0]])
    w = np.array([2.0, -1.0, 0.5])
    scores = atom_contribution_scores(X, w)

    assert scores.shape == (3,)
    np.testing.assert_allclose(scores, X @ w)
    assert int(np.argmax(scores)) == 0

    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "atomic-conv-protein-ligand-binding",
    title: "Atomic Convolutional Networks for Predicting Protein-Ligand Binding Affinity",
    year: 2017,
    authors: ["Gomes", "Ramsundar", "Feinberg", "Pande"],
    tags: ["Biology", "Chemistry", "Protein Ligand", "3D Structure", "Drug Discovery", "Visualization"],
    track: "chemistry",
    sourceUrl: "https://arxiv.org/abs/1703.10603",
    visual: {
      variant: "protein",
      caption: "Protein-ligand features are built from 3D atom coordinates, radial shells, and contact maps.",
      tools: [{ label: "PyMolAI reference", href: "https://github.com/ravishar313/PyMolAI" }],
    },
    description:
      "Atomic convolutional networks learn protein-ligand interactions from 3D coordinates. This implementation track builds distance matrices, radial shells, contact maps, and visualization-ready interaction features.",
    tasks: [
      {
        slug: "protein-ligand-distances",
        title: "Protein-Ligand Distances",
        difficulty: "easy",
        category: "3D Structure",
        solveCount: 58,
        description: `# Protein-Ligand Distances

## Problem Description

Structure-based models begin with atom coordinates. Implement pairwise Euclidean distances between protein atoms and ligand atoms.`,
        skeleton: `import numpy as np

def pairwise_distances(protein_xyz, ligand_xyz):
    """
    Return distances with shape (n_protein_atoms, n_ligand_atoms).
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_protein_ligand_distances():
    protein = np.array([[0.0, 0.0, 0.0], [0.0, 3.0, 4.0]])
    ligand = np.array([[1.0, 0.0, 0.0], [0.0, 0.0, 2.0]])
    d = pairwise_distances(protein, ligand)

    assert d.shape == (2, 2)
    np.testing.assert_allclose(d[0], np.array([1.0, 2.0]))
    np.testing.assert_allclose(d[1, 0], np.sqrt(26.0))

    print("All tests passed!")`,
      },
      {
        slug: "radial-shell-features",
        title: "Radial Shell Features",
        difficulty: "medium",
        category: "Protein Ligand",
        solveCount: 43,
        description: `# Radial Shell Features

## Problem Description

Atomic convolution features count nearby atoms inside radial shells. Implement shell counts for each ligand atom from a protein-ligand distance matrix.`,
        skeleton: `import numpy as np

def radial_shell_features(distances, cutoffs):
    """
    Count protein atoms around each ligand atom in consecutive radial shells.
    cutoffs example: [0.0, 2.0, 4.0, 6.0]
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_radial_shell_features():
    distances = np.array([
        [1.0, 3.5],
        [2.5, 4.5],
        [5.5, 1.5],
    ])
    feats = radial_shell_features(distances, [0.0, 2.0, 4.0, 6.0])

    assert feats.shape == (2, 3)
    np.testing.assert_array_equal(feats[0], np.array([1, 1, 1]))
    np.testing.assert_array_equal(feats[1], np.array([1, 1, 1]))

    print("All tests passed!")`,
      },
      {
        slug: "binding-contact-map",
        title: "Binding Contact Map",
        difficulty: "easy",
        category: "Visualization",
        solveCount: 46,
        description: `# Binding Contact Map

## Problem Description

Protein-ligand viewers often highlight close contacts. Build a contact map helper that returns atom pairs within a cutoff for visualization panels.`,
        skeleton: `import numpy as np

def binding_contact_map(protein_atoms, ligand_atoms, protein_xyz, ligand_xyz, cutoff=4.0):
    """
    Return contacts as tuples: (protein_atom, ligand_atom, distance).
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_binding_contact_map():
    protein_atoms = ["ASP:OD1", "TYR:OH"]
    ligand_atoms = ["LIG:N1", "LIG:C2"]
    protein_xyz = np.array([[0.0, 0.0, 0.0], [6.0, 0.0, 0.0]])
    ligand_xyz = np.array([[1.5, 0.0, 0.0], [9.5, 0.0, 0.0]])

    contacts = binding_contact_map(protein_atoms, ligand_atoms, protein_xyz, ligand_xyz, cutoff=4.0)
    assert len(contacts) == 1
    assert contacts[0][0] == "ASP:OD1"
    assert contacts[0][1] == "LIG:N1"
    assert abs(contacts[0][2] - 1.5) < 1e-8

    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "molgan-molecular-graphs",
    title: "MolGAN: An Implicit Generative Model for Small Molecular Graphs",
    year: 2018,
    authors: ["De Cao", "Kipf"],
    tags: ["Chemistry", "Generative Models", "GAN", "Molecular Graphs", "Drug Discovery", "Visualization"],
    track: "chemistry",
    sourceUrl: "https://arxiv.org/abs/1805.11973",
    visual: {
      variant: "generative",
      caption: "Molecular generation can be visualized as candidate atom types, edge tensors, validity checks, and property rewards.",
    },
    description:
      "MolGAN adapts adversarial generation to small molecular graphs. This track implements graph sampling, validity checks, and reward scoring used by generative chemistry interfaces.",
    tasks: [
      {
        slug: "graph-generator-sampling",
        title: "Graph Generator Sampling",
        difficulty: "medium",
        category: "Generative Models",
        solveCount: 39,
        description: `# Graph Generator Sampling

## Problem Description

MolGAN represents molecules as node types and edge tensors. Implement deterministic sampling from probability tables by taking the highest-probability atom and bond classes.`,
        skeleton: `import numpy as np

def sample_molecular_graph(node_probs, edge_probs):
    """
    node_probs: shape (n_atoms, n_atom_types)
    edge_probs: shape (n_atoms, n_atoms, n_bond_types)

    Bond type 0 means no bond. Return atom_types and adjacency.
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_graph_generator_sampling():
    node_probs = np.array([[0.1, 0.9], [0.8, 0.2], [0.3, 0.7]])
    edge_probs = np.zeros((3, 3, 2))
    edge_probs[:, :, 0] = 0.8
    edge_probs[0, 1, 1] = edge_probs[1, 0, 1] = 0.9
    edge_probs[1, 2, 1] = edge_probs[2, 1, 1] = 0.95

    atom_types, adjacency = sample_molecular_graph(node_probs, edge_probs)
    assert atom_types.tolist() == [1, 0, 1]
    assert adjacency.shape == (3, 3)
    assert adjacency[0, 1] == 1 and adjacency[1, 2] == 1
    assert adjacency[0, 0] == 0
    np.testing.assert_array_equal(adjacency, adjacency.T)

    print("All tests passed!")`,
      },
      {
        slug: "molecular-validity-check",
        title: "Molecular Validity Check",
        difficulty: "easy",
        category: "Chemistry",
        solveCount: 44,
        description: `# Molecular Validity Check

## Problem Description

Generative molecule models need validity checks. Implement a lightweight valence check for generated molecular graphs.`,
        skeleton: `import numpy as np

def molecular_validity(adjacency, atom_types, valence_limits):
    """
    Return True only when adjacency is symmetric, has no self bonds,
    and every atom degree is within its valence limit.
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_molecular_validity_check():
    A = np.array([[0, 1, 1], [1, 0, 0], [1, 0, 0]])
    atom_types = ["O", "H", "H"]
    limits = {"O": 2, "H": 1}
    assert molecular_validity(A, atom_types, limits) is True

    bad = np.array([[0, 1, 1, 1], [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0]])
    assert molecular_validity(bad, ["O", "H", "H", "H"], limits) is False

    nonsymmetric = np.array([[0, 1], [0, 0]])
    assert molecular_validity(nonsymmetric, ["C", "C"], {"C": 4}) is False

    print("All tests passed!")`,
      },
      {
        slug: "property-reward-score",
        title: "Property Reward Score",
        difficulty: "easy",
        category: "Generative Models",
        solveCount: 41,
        description: `# Property Reward Score

## Problem Description

MolGAN combines generation with property-oriented rewards. Implement a weighted reward aggregator for validity, drug-likeness, and uniqueness metrics.`,
        skeleton: `def property_reward_score(metrics, weights=None):
    """
    metrics: dict with numeric values such as validity, qed, uniqueness
    weights: optional dict with the same keys
    """
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_property_reward_score():
    metrics = {"validity": 1.0, "qed": 0.7, "uniqueness": 0.5}
    weights = {"validity": 0.5, "qed": 0.3, "uniqueness": 0.2}
    score = property_reward_score(metrics, weights)
    assert abs(score - 0.81) < 1e-8

    default_score = property_reward_score({"a": 1.0, "b": 0.0})
    assert abs(default_score - 0.5) < 1e-8

    print("All tests passed!")`,
      },
    ],
  },
];
