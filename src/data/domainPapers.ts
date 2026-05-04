import type { Difficulty, Paper, PaperTrack, PaperVisual, Task } from "./papers";

type DomainTrack = Exclude<PaperTrack, "ml">;
type TaskKind =
  | "sequence"
  | "expression"
  | "image"
  | "structure"
  | "phylogeny"
  | "variant"
  | "descriptor"
  | "molecular-graph"
  | "docking"
  | "quantum"
  | "generation"
  | "reaction"
  | "fingerprint"
  | "power"
  | "control"
  | "signals"
  | "machines"
  | "grid"
  | "filter"
  | "logic"
  | "sequential"
  | "cmos"
  | "analog"
  | "vlsi"
  | "processor"
  | "memory"
  | "mixed-signal";

interface PaperSpec {
  slug: string;
  title: string;
  year: number;
  authors: string[];
  track: DomainTrack;
  tags: string[];
  description: string;
  sourceUrl: string;
  repositoryUrl?: string;
  visual: PaperVisual["variant"];
  kind: TaskKind;
}

const biologySpecs: PaperSpec[] = [
  {
    slug: "alphafold2-protein-structure",
    title: "Highly Accurate Protein Structure Prediction with AlphaFold",
    year: 2021,
    authors: ["Jumper", "Evans", "Pritzel", "et al."],
    track: "biology",
    tags: ["Biology", "Protein Folding", "Structure", "Deep Learning"],
    description: "AlphaFold redesigned protein structure prediction around attention, pair representations, recycling, and confidence estimation. Implement contact-map and structure-evaluation primitives behind protein visualization.",
    sourceUrl: "https://www.nature.com/articles/s41586-021-03819-2",
    visual: "structure",
    kind: "structure",
  },
  {
    slug: "alphafold-human-proteome",
    title: "Highly Accurate Protein Structure Prediction for the Human Proteome",
    year: 2021,
    authors: ["Tunyasuvunakool", "Adler", "Wu", "et al."],
    track: "biology",
    tags: ["Biology", "Proteome", "Structure", "Visualization"],
    description: "This companion AlphaFold paper scales structure prediction to proteome coverage. Practice batching coordinates and confidence tracks for visual proteome inspection.",
    sourceUrl: "https://www.nature.com/articles/s41586-021-03828-1",
    visual: "structure",
    kind: "structure",
  },
  {
    slug: "deepbind-sequence-specificities",
    title: "Predicting Sequence Specificities of DNA- and RNA-Binding Proteins by Deep Learning",
    year: 2015,
    authors: ["Alipanahi", "Delong", "Weirauch", "Frey"],
    track: "biology",
    tags: ["Biology", "Genomics", "Sequence Models", "Motifs"],
    description: "DeepBind learns binding motifs from raw biological sequences. Implement DNA one-hot encodings and motif-position scanners that power mutation-map visualizations.",
    sourceUrl: "https://www.nature.com/articles/nbt.3300",
    visual: "genomics",
    kind: "sequence",
  },
  {
    slug: "deepsea-noncoding-variants",
    title: "Predicting Effects of Noncoding Variants with Deep Learning-Based Sequence Model",
    year: 2015,
    authors: ["Zhou", "Troyanskaya"],
    track: "biology",
    tags: ["Biology", "Genomics", "Variant Effects", "Deep Learning"],
    description: "DeepSEA predicts chromatin effects from sequence and scores noncoding variants. Build small variant scoring and sequence-window utilities.",
    sourceUrl: "https://www.nature.com/articles/nmeth.3547",
    visual: "genomics",
    kind: "variant",
  },
  {
    slug: "enformer-long-range-expression",
    title: "Effective Gene Expression Prediction from Sequence by Integrating Long-Range Interactions",
    year: 2021,
    authors: ["Avsec", "Agarwal", "Visentin", "et al."],
    track: "biology",
    tags: ["Biology", "Genomics", "Transformer", "Gene Expression"],
    description: "Enformer uses long sequence context to predict expression tracks. Implement binned signal aggregation and sequence feature encoders.",
    sourceUrl: "https://www.nature.com/articles/s41592-021-01252-x",
    visual: "genomics",
    kind: "sequence",
  },
  {
    slug: "scvi-single-cell-transcriptomics",
    title: "Deep Generative Modeling for Single-Cell Transcriptomics",
    year: 2018,
    authors: ["Lopez", "Regier", "Cole", "et al."],
    track: "biology",
    tags: ["Biology", "Single Cell", "VAE", "Gene Expression"],
    description: "scVI models single-cell count data with latent variables and batch correction. Implement count normalization and variable-gene selection.",
    sourceUrl: "https://www.nature.com/articles/s41592-018-0229-2",
    repositoryUrl: "https://github.com/scverse/scvi-tools",
    visual: "single-cell",
    kind: "expression",
  },
  {
    slug: "scgen-perturbation-prediction",
    title: "Single-Cell Perturbation Prediction with scGen",
    year: 2019,
    authors: ["Lotfollahi", "Wolf", "Theis"],
    track: "biology",
    tags: ["Biology", "Single Cell", "Perturbation", "Generative Models"],
    description: "scGen predicts perturbation response in latent expression space. Implement expression deltas and perturbation projection helpers.",
    sourceUrl: "https://www.nature.com/articles/s41592-019-0494-8",
    visual: "single-cell",
    kind: "expression",
  },
  {
    slug: "cellpose-generalist-segmentation",
    title: "Cellpose: A Generalist Algorithm for Cellular Segmentation",
    year: 2021,
    authors: ["Stringer", "Wang", "Michaelos", "Pachitariu"],
    track: "biology",
    tags: ["Biology", "Cell Imaging", "Segmentation", "Visualization"],
    description: "Cellpose segments cells across microscopy modalities. Implement segmentation metrics and bounding boxes for inspection overlays.",
    sourceUrl: "https://www.nature.com/articles/s41592-020-01018-x",
    repositoryUrl: "https://github.com/MouseLand/cellpose",
    visual: "cell",
    kind: "image",
  },
  {
    slug: "unet-biomedical-segmentation",
    title: "U-Net: Convolutional Networks for Biomedical Image Segmentation",
    year: 2015,
    authors: ["Ronneberger", "Fischer", "Brox"],
    track: "biology",
    tags: ["Biology", "Medical Imaging", "Segmentation", "CNN"],
    description: "U-Net introduced encoder-decoder skip connections for biomedical segmentation. Implement mask metrics and patch layout helpers.",
    sourceUrl: "https://arxiv.org/abs/1505.04597",
    visual: "cell",
    kind: "image",
  },
  {
    slug: "crispr-programmable-endonuclease",
    title: "A Programmable Dual-RNA-Guided DNA Endonuclease in Adaptive Bacterial Immunity",
    year: 2012,
    authors: ["Jinek", "Chylinski", "Fonfara", "et al."],
    track: "biology",
    tags: ["Biology", "CRISPR", "Genome Editing", "Sequence Models"],
    description: "This CRISPR-Cas9 paper established programmable guide targeting. Implement guide matching and mismatch scoring.",
    sourceUrl: "https://www.science.org/doi/10.1126/science.1225829",
    visual: "genomics",
    kind: "sequence",
  },
  {
    slug: "blast-local-alignment",
    title: "Basic Local Alignment Search Tool",
    year: 1990,
    authors: ["Altschul", "Gish", "Miller", "Myers", "Lipman"],
    track: "biology",
    tags: ["Biology", "Bioinformatics", "Sequence Alignment", "Search"],
    description: "BLAST made fast local sequence search practical. Implement k-mer lookup and simple local-alignment scoring.",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/2231712/",
    visual: "genomics",
    kind: "sequence",
  },
  {
    slug: "clustalw-multiple-alignment",
    title: "CLUSTAL W: Improving the Sensitivity of Progressive Multiple Sequence Alignment",
    year: 1994,
    authors: ["Thompson", "Higgins", "Gibson"],
    track: "biology",
    tags: ["Biology", "Bioinformatics", "Alignment", "Phylogeny"],
    description: "CLUSTAL W improves progressive alignment with sequence weighting and gap penalties. Practice pairwise distance and guide-tree helpers.",
    sourceUrl: "https://academic.oup.com/nar/article/22/22/4673/2400290",
    visual: "phylogeny",
    kind: "phylogeny",
  },
  {
    slug: "neighbor-joining-method",
    title: "The Neighbor-Joining Method: A New Method for Reconstructing Phylogenetic Trees",
    year: 1987,
    authors: ["Saitou", "Nei"],
    track: "biology",
    tags: ["Biology", "Phylogeny", "Evolution", "Distance Methods"],
    description: "Neighbor joining reconstructs phylogenetic trees from distance matrices. Implement distance corrections and nearest-pair selection.",
    sourceUrl: "https://academic.oup.com/mbe/article/4/4/406/1029664",
    visual: "phylogeny",
    kind: "phylogeny",
  },
  {
    slug: "hmmer-profile-hidden-markov-models",
    title: "Profile Hidden Markov Models",
    year: 1998,
    authors: ["Eddy"],
    track: "biology",
    tags: ["Biology", "HMM", "Protein Families", "Sequence Models"],
    description: "Profile HMMs model conserved biological sequence families. Implement log-probability scoring and emission tables.",
    sourceUrl: "https://academic.oup.com/bioinformatics/article/14/9/755/259550",
    visual: "genomics",
    kind: "sequence",
  },
  {
    slug: "deepvariant-genome-calling",
    title: "A Universal SNP and Small-Indel Variant Caller Using Deep Neural Networks",
    year: 2018,
    authors: ["Poplin", "Chang", "Alexander", "et al."],
    track: "biology",
    tags: ["Biology", "Variant Calling", "Genomics", "Deep Learning"],
    description: "DeepVariant turns read pileups into image-like tensors for variant calling. Implement pileup channel summaries and genotype scoring.",
    sourceUrl: "https://www.nature.com/articles/nbt.4235",
    repositoryUrl: "https://github.com/google/deepvariant",
    visual: "genomics",
    kind: "variant",
  },
  {
    slug: "seurat-single-cell-genomics",
    title: "Spatial Reconstruction of Single-Cell Gene Expression Data",
    year: 2015,
    authors: ["Satija", "Farrell", "Gennert", "et al."],
    track: "biology",
    tags: ["Biology", "Single Cell", "Clustering", "Gene Expression"],
    description: "Seurat linked single-cell expression profiles to spatial and cluster structure. Implement normalization and marker ranking.",
    sourceUrl: "https://www.nature.com/articles/nbt.3192",
    repositoryUrl: "https://github.com/satijalab/seurat",
    visual: "single-cell",
    kind: "expression",
  },
  {
    slug: "monocle-pseudotime-ordering",
    title: "The Dynamics and Regulators of Cell Fate Decisions Are Revealed by Pseudotemporal Ordering",
    year: 2014,
    authors: ["Trapnell", "Cacchiarelli", "Grimsby", "et al."],
    track: "biology",
    tags: ["Biology", "Single Cell", "Pseudotime", "Trajectory"],
    description: "Monocle orders cells along trajectories to infer differentiation dynamics. Implement pseudotime scaling and trajectory edge extraction.",
    sourceUrl: "https://www.nature.com/articles/nbt.2859",
    visual: "single-cell",
    kind: "expression",
  },
  {
    slug: "scanpy-single-cell-analysis",
    title: "SCANPY: Large-Scale Single-Cell Gene Expression Data Analysis",
    year: 2018,
    authors: ["Wolf", "Angerer", "Theis"],
    track: "biology",
    tags: ["Biology", "Single Cell", "Python", "Clustering"],
    description: "Scanpy provides scalable single-cell analysis in Python. Implement sparse-like normalization and neighborhood summaries.",
    sourceUrl: "https://genomebiology.biomedcentral.com/articles/10.1186/s13059-017-1382-0",
    repositoryUrl: "https://github.com/scverse/scanpy",
    visual: "single-cell",
    kind: "expression",
  },
  {
    slug: "tcoffee-multiple-sequence-alignment",
    title: "T-Coffee: A Novel Method for Fast and Accurate Multiple Sequence Alignment",
    year: 2000,
    authors: ["Notredame", "Higgins", "Heringa"],
    track: "biology",
    tags: ["Biology", "Alignment", "Bioinformatics", "Sequence Models"],
    description: "T-Coffee combines multiple alignment evidence sources into a consistency library. Implement pairwise evidence aggregation.",
    sourceUrl: "https://academic.oup.com/jmb/article/302/1/205/987598",
    visual: "phylogeny",
    kind: "phylogeny",
  },
  {
    slug: "biopython-toolkit",
    title: "Biopython: Freely Available Python Tools for Computational Molecular Biology and Bioinformatics",
    year: 2009,
    authors: ["Cock", "Antao", "Chang", "et al."],
    track: "biology",
    tags: ["Biology", "Bioinformatics", "Python", "Tooling"],
    description: "Biopython standardized reusable sequence and molecular biology tooling in Python. Implement sequence parsing and feature-track utilities.",
    sourceUrl: "https://academic.oup.com/bioinformatics/article/25/11/1422/330687",
    repositoryUrl: "https://github.com/biopython/biopython",
    visual: "genomics",
    kind: "sequence",
  },
];

const chemistrySpecs: PaperSpec[] = [
  {
    slug: "chemberta-molecular-property",
    title: "ChemBERTa: Large-Scale Self-Supervised Pretraining for Molecular Property Prediction",
    year: 2020,
    authors: ["Chithrananda", "Grand", "Ramsundar"],
    track: "chemistry",
    tags: ["Chemistry", "SMILES", "Transformer", "Molecular Property"],
    description: "ChemBERTa applies masked-language-model pretraining to SMILES strings. Implement tokenization and masked-token utilities for chemical sequences.",
    sourceUrl: "https://arxiv.org/abs/2010.09885",
    visual: "chemistry",
    kind: "descriptor",
  },
  {
    slug: "unimol-3d-molecular-representation",
    title: "Uni-Mol: A Universal 3D Molecular Representation Learning Framework",
    year: 2023,
    authors: ["Zhou", "Dong", "Wang", "et al."],
    track: "chemistry",
    tags: ["Chemistry", "3D Molecules", "Transformer", "Representation Learning"],
    description: "Uni-Mol learns 3D molecule and pocket representations. Implement distance matrices and radial features for 3D molecular visualization.",
    sourceUrl: "https://openreview.net/forum?id=6K2RM6wVqKu",
    visual: "chemistry-3d",
    kind: "quantum",
  },
  {
    slug: "molclr-contrastive-learning",
    title: "Molecular Contrastive Learning of Representations via Graph Neural Networks",
    year: 2022,
    authors: ["Wang", "Wang", "Zhu", "et al."],
    track: "chemistry",
    tags: ["Chemistry", "GraphConv", "Contrastive Learning", "Molecular Property"],
    description: "MolCLR pretrains graph neural networks with molecular augmentations. Implement graph degrees and representation similarity.",
    sourceUrl: "https://www.nature.com/articles/s42256-022-00447-x",
    repositoryUrl: "https://github.com/yuyangw/MolCLR",
    visual: "chemistry",
    kind: "molecular-graph",
  },
  {
    slug: "diffdock-molecular-docking",
    title: "DiffDock: Diffusion Steps, Twists, and Turns for Molecular Docking",
    year: 2023,
    authors: ["Corso", "Stark", "Jing", "et al."],
    track: "chemistry",
    tags: ["Chemistry", "Docking", "Diffusion", "Drug Discovery"],
    description: "DiffDock models ligand pose generation as diffusion over translations, rotations, and torsions. Implement RMSD and pose scoring helpers.",
    sourceUrl: "https://arxiv.org/abs/2210.01776",
    repositoryUrl: "https://github.com/gcorso/DiffDock",
    visual: "docking",
    kind: "docking",
  },
  {
    slug: "schnet-quantum-interactions",
    title: "SchNet: A Continuous-Filter Convolutional Neural Network for Modeling Quantum Interactions",
    year: 2017,
    authors: ["Schutt", "Kindermans", "Sauceda", "et al."],
    track: "chemistry",
    tags: ["Chemistry", "Quantum Chemistry", "GraphConv", "3D Molecules"],
    description: "SchNet uses continuous filters over atom distances for quantum chemistry. Implement radial basis features and Coulomb-like matrices.",
    sourceUrl: "https://arxiv.org/abs/1706.08566",
    visual: "chemistry-3d",
    kind: "quantum",
  },
  {
    slug: "mpnn-quantum-chemistry",
    title: "Neural Message Passing for Quantum Chemistry",
    year: 2017,
    authors: ["Gilmer", "Schoenholz", "Riley", "et al."],
    track: "chemistry",
    tags: ["Chemistry", "GraphConv", "Quantum Chemistry", "Message Passing"],
    description: "This paper unified molecular graph models as message passing neural networks. Implement graph message aggregation and readout pooling.",
    sourceUrl: "https://arxiv.org/abs/1704.01212",
    visual: "chemistry",
    kind: "molecular-graph",
  },
  {
    slug: "jtnn-molecular-generation",
    title: "Junction Tree Variational Autoencoder for Molecular Graph Generation",
    year: 2018,
    authors: ["Jin", "Barzilay", "Jaakkola"],
    track: "chemistry",
    tags: ["Chemistry", "Generative Models", "Molecular Graphs", "VAE"],
    description: "JT-VAE generates valid molecules by composing molecular substructure trees. Implement valence checks and novelty scoring.",
    sourceUrl: "https://arxiv.org/abs/1802.04364",
    repositoryUrl: "https://github.com/wengong-jin/icml18-jtnn",
    visual: "generative",
    kind: "generation",
  },
  {
    slug: "moses-molecular-generation-benchmark",
    title: "Molecular Sets (MOSES): A Benchmarking Platform for Molecular Generation Models",
    year: 2019,
    authors: ["Polykovskiy", "Zhebrak", "Vetrov", "et al."],
    track: "chemistry",
    tags: ["Chemistry", "Generative Models", "Benchmarking", "Drug Discovery"],
    description: "MOSES benchmarks generative molecule models with validity, uniqueness, novelty, and property metrics. Implement reward summaries for generated molecules.",
    sourceUrl: "https://arxiv.org/abs/1811.12823",
    visual: "generative",
    kind: "generation",
  },
  {
    slug: "graphaf-molecular-graph-generation",
    title: "GraphAF: A Flow-Based Autoregressive Model for Molecular Graph Generation",
    year: 2020,
    authors: ["Shi", "Xu", "Zhu", "et al."],
    track: "chemistry",
    tags: ["Chemistry", "Generative Models", "Molecular Graphs", "Normalizing Flows"],
    description: "GraphAF generates molecular graphs through autoregressive normalizing flows. Implement graph validity and edge-sampling helpers.",
    sourceUrl: "https://arxiv.org/abs/2001.09382",
    visual: "generative",
    kind: "generation",
  },
  {
    slug: "g-schnet-molecular-design",
    title: "Symmetry-Adapted Generation of 3D Point Sets for the Targeted Discovery of Molecules",
    year: 2019,
    authors: ["Gebauer", "Gastegger", "Schutt"],
    track: "chemistry",
    tags: ["Chemistry", "3D Molecules", "Generative Models", "Quantum Chemistry"],
    description: "G-SchNet generates atomistic 3D structures while preserving geometric symmetries. Implement radial shells and coordinate layout utilities.",
    sourceUrl: "https://arxiv.org/abs/1906.00957",
    visual: "chemistry-3d",
    kind: "quantum",
  },
  {
    slug: "physnet-neural-network-potential",
    title: "PhysNet: A Neural Network for Predicting Energies, Forces, Dipole Moments and Partial Charges",
    year: 2019,
    authors: ["Unke", "Meuwly"],
    track: "chemistry",
    tags: ["Chemistry", "Quantum Chemistry", "Molecular Dynamics", "Neural Potentials"],
    description: "PhysNet predicts molecular energies and forces with physically motivated neural potentials. Implement pairwise energy and force-shape helpers.",
    sourceUrl: "https://pubs.acs.org/doi/10.1021/acs.jctc.9b00181",
    visual: "chemistry-3d",
    kind: "quantum",
  },
  {
    slug: "ani1-neural-network-potentials",
    title: "ANI-1: An Extensible Neural Network Potential with DFT Accuracy at Force Field Computational Cost",
    year: 2017,
    authors: ["Smith", "Isayev", "Roitberg"],
    track: "chemistry",
    tags: ["Chemistry", "Quantum Chemistry", "Neural Potentials", "Molecular Dynamics"],
    description: "ANI-1 uses atom-centered symmetry functions for fast neural molecular potentials. Implement radial descriptors and energy aggregation.",
    sourceUrl: "https://pubs.rsc.org/en/content/articlelanding/2017/sc/c6sc05720a",
    visual: "chemistry-3d",
    kind: "quantum",
  },
  {
    slug: "autodock-vina",
    title: "AutoDock Vina: Improving the Speed and Accuracy of Docking",
    year: 2010,
    authors: ["Trott", "Olson"],
    track: "chemistry",
    tags: ["Chemistry", "Docking", "Drug Discovery", "Scoring"],
    description: "AutoDock Vina is a widely used docking/scoring method. Implement pose RMSD and contact-based scoring kernels.",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/19499576/",
    visual: "docking",
    kind: "docking",
  },
  {
    slug: "ecfp-circular-fingerprints",
    title: "Extended-Connectivity Fingerprints",
    year: 2010,
    authors: ["Rogers", "Hahn"],
    track: "chemistry",
    tags: ["Chemistry", "Fingerprints", "Molecular Property", "Similarity"],
    description: "ECFP fingerprints encode circular neighborhoods for molecular similarity. Implement folded fingerprints and Tanimoto similarity.",
    sourceUrl: "https://pubs.acs.org/doi/10.1021/ci100050t",
    visual: "molecule",
    kind: "fingerprint",
  },
  {
    slug: "morgan-chemical-structure-coding",
    title: "The Generation of a Unique Machine Description for Chemical Structures",
    year: 1965,
    authors: ["Morgan"],
    track: "chemistry",
    tags: ["Chemistry", "Fingerprints", "Graph Algorithms", "Cheminformatics"],
    description: "Morgan's algorithm underlies circular molecular identifiers. Implement neighborhood labels and fingerprint folding.",
    sourceUrl: "https://pubs.acs.org/doi/10.1021/c160017a018",
    visual: "molecule",
    kind: "fingerprint",
  },
  {
    slug: "qm9-quantum-chemistry-dataset",
    title: "Quantum Chemistry Structures and Properties of 134 kilo Molecules",
    year: 2014,
    authors: ["Ramakrishnan", "Dral", "Rupp", "von Lilienfeld"],
    track: "chemistry",
    tags: ["Chemistry", "Dataset", "Quantum Chemistry", "Molecular Property"],
    description: "QM9 provides computed quantum properties for small organic molecules. Implement property normalization and descriptor matrices.",
    sourceUrl: "https://www.nature.com/articles/sdata201422",
    visual: "benchmark",
    kind: "descriptor",
  },
  {
    slug: "dftd3-dispersion-correction",
    title: "A Consistent and Accurate Ab Initio Parametrization of Density Functional Dispersion Correction (DFT-D3)",
    year: 2010,
    authors: ["Grimme", "Antony", "Ehrlich", "Krieg"],
    track: "chemistry",
    tags: ["Chemistry", "Quantum Chemistry", "DFT", "Molecular Energy"],
    description: "DFT-D3 adds empirical dispersion corrections to density functional theory. Implement pair-distance energy terms.",
    sourceUrl: "https://pubs.aip.org/aip/jcp/article/132/15/154104/926936",
    visual: "chemistry-3d",
    kind: "quantum",
  },
  {
    slug: "rxnfp-reaction-fingerprints",
    title: "Mapping the Space of Chemical Reactions Using Attention-Based Neural Networks",
    year: 2021,
    authors: ["Schwaller", "Probst", "Vaucher", "et al."],
    track: "chemistry",
    tags: ["Chemistry", "Reactions", "Transformer", "Fingerprints"],
    description: "RXNFP learns reaction fingerprints from transformer attention. Implement atom-balance checks and reaction ranking helpers.",
    sourceUrl: "https://www.nature.com/articles/s42256-020-00284-w",
    visual: "reaction",
    kind: "reaction",
  },
  {
    slug: "molecular-transformer-reaction-prediction",
    title: "Molecular Transformer: A Model for Uncertainty-Calibrated Chemical Reaction Prediction",
    year: 2019,
    authors: ["Schwaller", "Laino", "Gaudin", "et al."],
    track: "chemistry",
    tags: ["Chemistry", "Reactions", "Transformer", "Synthesis"],
    description: "The Molecular Transformer frames reaction prediction as sequence translation. Implement reaction-token parsing and balanced-product checks.",
    sourceUrl: "https://pubs.acs.org/doi/10.1021/acscentsci.9b00576",
    visual: "reaction",
    kind: "reaction",
  },
  {
    slug: "chemprop-directed-message-passing",
    title: "Analyzing Learned Molecular Representations for Property Prediction",
    year: 2019,
    authors: ["Yang", "Swanson", "Jin", "et al."],
    track: "chemistry",
    tags: ["Chemistry", "GraphConv", "Molecular Property", "Drug Discovery"],
    description: "Chemprop's directed message passing model remains a strong molecular property baseline. Implement directed edge features and graph pooling.",
    sourceUrl: "https://pubs.acs.org/doi/10.1021/acs.jcim.9b00237",
    repositoryUrl: "https://github.com/chemprop/chemprop",
    visual: "chemistry",
    kind: "molecular-graph",
  },
];

const electricalSpecs: PaperSpec[] = [
  {
    slug: "tinney-hart-newton-power-flow",
    title: "Power Flow Solution by Newton's Method",
    year: 1967,
    authors: ["Tinney", "Hart"],
    track: "electrical",
    tags: ["Electrical Learning", "Power Systems", "Newton Method", "Grid"],
    description: "A foundational Newton power-flow method for electric grids. Implement admittance matrices and DC power-flow updates.",
    sourceUrl: "https://www.scirp.org/reference/ReferencesPapers?ReferenceID=1580339",
    visual: "power",
    kind: "power",
  },
  {
    slug: "fast-decoupled-load-flow",
    title: "Fast Decoupled Load Flow",
    year: 1974,
    authors: ["Stott", "Alsac"],
    track: "electrical",
    tags: ["Electrical Learning", "Power Systems", "Load Flow", "Grid"],
    description: "Fast decoupled load flow exploits weak P-V and Q-angle coupling. Implement sparse-like susceptance updates.",
    sourceUrl: "https://ieeexplore.ieee.org/document/4074710",
    visual: "power",
    kind: "power",
  },
  {
    slug: "kalman-filter-linear-systems",
    title: "A New Approach to Linear Filtering and Prediction Problems",
    year: 1960,
    authors: ["Kalman"],
    track: "electrical",
    tags: ["Electrical Learning", "Control", "State Estimation", "Signals"],
    description: "Kalman's recursive estimator is central to control, navigation, and power-grid state estimation. Implement prediction and correction equations.",
    sourceUrl: "https://doi.org/10.1115/1.3662552",
    visual: "signals",
    kind: "control",
  },
  {
    slug: "park-two-reaction-theory",
    title: "Two-Reaction Theory of Synchronous Machines",
    year: 1929,
    authors: ["Park"],
    track: "electrical",
    tags: ["Electrical Learning", "Machines", "dq Transform", "Power Systems"],
    description: "Park's dq transform simplifies analysis of rotating electrical machines. Implement alpha-beta to dq transforms and slip helpers.",
    sourceUrl: "https://doi.org/10.1109/T-AIEE.1929.5055275",
    visual: "machines",
    kind: "machines",
  },
  {
    slug: "instantaneous-reactive-power-theory",
    title: "Instantaneous Reactive Power Compensators Comprising Switching Devices without Energy Storage Components",
    year: 1984,
    authors: ["Akagi", "Kanazawa", "Nabae"],
    track: "electrical",
    tags: ["Electrical Learning", "Power Electronics", "Reactive Power", "Signals"],
    description: "The p-q theory analyzes instantaneous real/reactive power in three-phase systems. Implement Clarke transforms and power components.",
    sourceUrl: "https://doi.org/10.1109/TIA.1984.4504460",
    visual: "signals",
    kind: "signals",
  },
  {
    slug: "mppt-photovoltaic-array",
    title: "Comparison of Photovoltaic Array Maximum Power Point Tracking Techniques",
    year: 2007,
    authors: ["Esram", "Chapman"],
    track: "electrical",
    tags: ["Electrical Learning", "Renewable Energy", "MPPT", "Power Electronics"],
    description: "This survey organizes practical MPPT strategies for PV systems. Implement perturb-and-observe and power-curve helpers.",
    sourceUrl: "https://doi.org/10.1109/TEC.2006.874230",
    visual: "power",
    kind: "grid",
  },
  {
    slug: "droop-control-parallel-inverters",
    title: "Decentralized Control for Parallel Operation of Distributed Generation Inverters",
    year: 2007,
    authors: ["Guerrero", "Matas", "de Vicuna", "et al."],
    track: "electrical",
    tags: ["Electrical Learning", "Microgrids", "Droop Control", "Inverters"],
    description: "Droop control lets inverter-based resources share load without fast communication. Implement frequency and voltage droop equations.",
    sourceUrl: "https://doi.org/10.1109/TIE.2006.888771",
    visual: "power",
    kind: "grid",
  },
  {
    slug: "lqr-optimal-control",
    title: "Contributions to the Theory of Optimal Control",
    year: 1960,
    authors: ["Kalman"],
    track: "electrical",
    tags: ["Electrical Learning", "Control", "LQR", "State Space"],
    description: "LQR formalized quadratic optimal control for linear systems. Implement cost evaluation and feedback updates.",
    sourceUrl: "https://doi.org/10.1007/BF02547108",
    visual: "signals",
    kind: "control",
  },
  {
    slug: "windowed-fourier-transform-power-signals",
    title: "The Short-Time Fourier Transform and Local Signals",
    year: 1946,
    authors: ["Gabor"],
    track: "electrical",
    tags: ["Electrical Learning", "Signals", "Fourier", "Power Quality"],
    description: "Time-frequency analysis supports power-quality and transient analysis. Implement discrete convolution and phasor-like summaries.",
    sourceUrl: "https://doi.org/10.1049/ji-3-2.1946.0074",
    visual: "signals",
    kind: "signals",
  },
  {
    slug: "butterworth-filter-design",
    title: "On the Theory of Filter Amplifiers",
    year: 1930,
    authors: ["Butterworth"],
    track: "electrical",
    tags: ["Electrical Learning", "Filters", "Signals", "Frequency Response"],
    description: "Butterworth filters trade rolloff for maximally flat passbands. Implement cutoff and low-pass response utilities.",
    sourceUrl: "https://doi.org/10.1049/jiee-1.1930.0154",
    visual: "signals",
    kind: "filter",
  },
];

const electronicsSpecs: PaperSpec[] = [
  {
    slug: "spice-circuit-simulation",
    title: "SPICE: Simulation Program with Integrated Circuit Emphasis",
    year: 1973,
    authors: ["Nagel", "Pederson"],
    track: "electronics",
    tags: ["Electronics Learning", "Circuit Simulation", "SPICE", "Analog"],
    description: "SPICE made nonlinear circuit simulation accessible. Implement nodal-analysis helpers and device stamping primitives.",
    sourceUrl: "https://www2.eecs.berkeley.edu/Pubs/TechRpts/1973/22871.html",
    visual: "analog",
    kind: "analog",
  },
  {
    slug: "dennard-mosfet-scaling",
    title: "Design of Ion-Implanted MOSFETs with Very Small Physical Dimensions",
    year: 1974,
    authors: ["Dennard", "Gaensslen", "Yu", "et al."],
    track: "electronics",
    tags: ["Electronics Learning", "CMOS", "MOSFET", "Scaling"],
    description: "Dennard scaling defines the classic constant-field MOSFET scaling relationships. Implement dynamic-power and scaling-law calculators.",
    sourceUrl: "https://doi.org/10.1109/JSSC.1974.1050511",
    visual: "cmos",
    kind: "cmos",
  },
  {
    slug: "mead-conway-vlsi-systems",
    title: "Introduction to VLSI Systems",
    year: 1980,
    authors: ["Mead", "Conway"],
    track: "electronics",
    tags: ["Electronics Learning", "VLSI", "Layout", "Digital Design"],
    description: "Mead and Conway democratized structured VLSI design. Implement layout metrics and delay-estimation helpers.",
    sourceUrl: "https://authors.library.caltech.edu/records/5trtx-m1e15/latest",
    visual: "layout",
    kind: "vlsi",
  },
  {
    slug: "mos-opamp-tutorial",
    title: "MOS Operational Amplifier Design: A Tutorial Overview",
    year: 1982,
    authors: ["Gray", "Meyer"],
    track: "electronics",
    tags: ["Electronics Learning", "Analog", "Op Amp", "CMOS"],
    description: "This tutorial surveys MOS op-amp architectures and design tradeoffs. Implement gain, bandwidth, and slew-limited response helpers.",
    sourceUrl: "https://doi.org/10.1109/JSSC.1982.1051883",
    visual: "analog",
    kind: "analog",
  },
  {
    slug: "chua-memristor",
    title: "Memristor: The Missing Circuit Element",
    year: 1971,
    authors: ["Chua"],
    track: "electronics",
    tags: ["Electronics Learning", "Memristor", "Nonlinear Circuits", "Memory"],
    description: "Chua postulated the memristor as a fourth fundamental element. Implement state updates and I-V trace helpers.",
    sourceUrl: "https://doi.org/10.1109/TCT.1971.1083337",
    visual: "memory",
    kind: "memory",
  },
  {
    slug: "missing-memristor-found",
    title: "The Missing Memristor Found",
    year: 2008,
    authors: ["Strukov", "Snider", "Stewart", "Williams"],
    track: "electronics",
    tags: ["Electronics Learning", "Memristor", "Nanoelectronics", "Memory"],
    description: "This Nature paper demonstrated a nanoscale memristive device. Implement simple drift-state and memory-window utilities.",
    sourceUrl: "https://www.nature.com/articles/nature06932",
    visual: "memory",
    kind: "memory",
  },
  {
    slug: "riscv-isa-manual",
    title: "The RISC-V Instruction Set Manual",
    year: 2014,
    authors: ["Waterman", "Lee", "Patterson", "Asanovic"],
    track: "electronics",
    tags: ["Electronics Learning", "Digital Logic", "RISC-V", "Processor"],
    description: "RISC-V provides an open instruction set for hardware learning. Implement instruction-field decoding and tiny ALU behavior.",
    sourceUrl: "https://docs.riscv.org/reference/isa/unpriv/rv32.html",
    repositoryUrl: "https://github.com/riscv/riscv-isa-manual",
    visual: "logic",
    kind: "processor",
  },
  {
    slug: "rocket-chip-generator",
    title: "The Rocket Chip Generator",
    year: 2016,
    authors: ["Asanovic", "Avizienis", "Bachrach", "et al."],
    track: "electronics",
    tags: ["Electronics Learning", "SoC", "RISC-V", "Generator"],
    description: "Rocket Chip shows generator-based SoC design in Chisel. Implement pipeline timing and hardware module graph helpers.",
    sourceUrl: "https://www2.eecs.berkeley.edu/Pubs/TechRpts/2016/EECS-2016-17.pdf",
    visual: "logic",
    kind: "processor",
  },
  {
    slug: "chisel-hardware-construction",
    title: "Chisel: Constructing Hardware in a Scala Embedded Language",
    year: 2012,
    authors: ["Bachrach", "Vo", "Richards", "et al."],
    track: "electronics",
    tags: ["Electronics Learning", "Digital Logic", "Hardware DSL", "Verilog"],
    description: "Chisel raises hardware design abstraction while emitting Verilog. Implement muxes, truth tables, and HDLBits-style logic primitives.",
    sourceUrl: "https://people.eecs.berkeley.edu/~krste/papers/chisel-dac2012.pdf",
    visual: "logic",
    kind: "logic",
  },
  {
    slug: "brokaw-bandgap-reference",
    title: "A Simple Three-Terminal IC Bandgap Reference",
    year: 1974,
    authors: ["Brokaw"],
    track: "electronics",
    tags: ["Electronics Learning", "Analog", "Voltage Reference", "Bandgap"],
    description: "The Brokaw bandgap is a classic voltage-reference topology. Implement PTAT/CTAT combination and output-error helpers.",
    sourceUrl: "https://doi.org/10.1109/JSSC.1974.1050519",
    visual: "analog",
    kind: "mixed-signal",
  },
];

export const domainPapers: Paper[] = [
  ...biologySpecs,
  ...chemistrySpecs,
  ...electricalSpecs,
  ...electronicsSpecs,
].map((spec, index) => makePaper(spec, index));

function makePaper(spec: PaperSpec, index: number): Paper {
  return {
    slug: spec.slug,
    title: spec.title,
    year: spec.year,
    authors: spec.authors,
    tags: spec.tags,
    description: spec.description,
    track: spec.track,
    sourceUrl: spec.sourceUrl,
    repositoryUrl: spec.repositoryUrl,
    visual: {
      variant: spec.visual,
      caption: makeCaption(spec),
      tools: makeTools(spec),
    },
    tasks: makeTasks(spec, index),
  };
}

function makeCaption(spec: PaperSpec): string {
  const trackLabel = {
    biology: "biological evidence",
    chemistry: "molecular structure",
    electrical: "system signals",
    electronics: "circuit behavior",
  }[spec.track];
  return `Interactive ${trackLabel} view for ${spec.title}: inspect the paper's core data representation, computed features, and implementation targets.`;
}

function makeTools(spec: PaperSpec): { label: string; href: string }[] {
  const tools = [{ label: "Source", href: spec.sourceUrl }];
  if (spec.repositoryUrl) tools.push({ label: "Code", href: spec.repositoryUrl });
  if (spec.track === "electronics") tools.push({ label: "HDLBits reference", href: "https://hdlbits.01xz.net/wiki/Main_Page" });
  return tools;
}

function makeTasks(spec: PaperSpec, index: number): Task[] {
  const solveBase = 40 + (index % 11) * 7;
  switch (spec.kind) {
    case "sequence":
      return [dnaOneHotTask(spec, solveBase), motifPositionsTask(spec, solveBase + 3)];
    case "variant":
      return [variantDeltaTask(spec, solveBase), pileupChannelsTask(spec, solveBase + 3)];
    case "expression":
      return [logNormalizeTask(spec, solveBase), topVariableGenesTask(spec, solveBase + 3)];
    case "image":
      return [diceScoreTask(spec, solveBase), boundingBoxesTask(spec, solveBase + 3)];
    case "structure":
      return [distanceMatrixTask(spec, solveBase), contactPairsTask(spec, solveBase + 3)];
    case "phylogeny":
      return [jukesCantorTask(spec, solveBase), nearestPairTask(spec, solveBase + 3)];
    case "descriptor":
      return [smilesTokenTask(spec, solveBase), formulaCountTask(spec, solveBase + 3)];
    case "molecular-graph":
      return [degreeVectorTask(spec, solveBase), graphReadoutTask(spec, solveBase + 3)];
    case "docking":
      return [rmsdTask(spec, solveBase), poseScoreTask(spec, solveBase + 3)];
    case "quantum":
      return [coulombMatrixTask(spec, solveBase), radialBasisTask(spec, solveBase + 3)];
    case "generation":
      return [valenceValidityTask(spec, solveBase), noveltyTask(spec, solveBase + 3)];
    case "reaction":
      return [reactionBalanceTask(spec, solveBase), yieldRankTask(spec, solveBase + 3)];
    case "fingerprint":
      return [foldFingerprintTask(spec, solveBase), tanimotoTask(spec, solveBase + 3)];
    case "power":
      return [ybusTask(spec, solveBase), dcPowerFlowTask(spec, solveBase + 3)];
    case "control":
      return [pidTask(spec, solveBase), stateFeedbackTask(spec, solveBase + 3)];
    case "signals":
      return [convolutionTask(spec, solveBase), phasorTask(spec, solveBase + 3)];
    case "machines":
      return [dqTransformTask(spec, solveBase), slipTask(spec, solveBase + 3)];
    case "grid":
      return [mpptTask(spec, solveBase), droopTask(spec, solveBase + 3)];
    case "filter":
      return [rcLowpassTask(spec, solveBase), cutoffTask(spec, solveBase + 3)];
    case "logic":
      return [muxTask(spec, solveBase), truthTableTask(spec, solveBase + 3)];
    case "sequential":
      return [dffTask(spec, solveBase), fsmTask(spec, solveBase + 3)];
    case "cmos":
      return [dynamicPowerTask(spec, solveBase), inverterTripTask(spec, solveBase + 3)];
    case "analog":
      return [gainDbTask(spec, solveBase), slewTask(spec, solveBase + 3)];
    case "vlsi":
      return [wirelengthTask(spec, solveBase), criticalPathTask(spec, solveBase + 3)];
    case "processor":
      return [rv32DecodeTask(spec, solveBase), aluTask(spec, solveBase + 3)];
    case "memory":
      return [memristorTask(spec, solveBase), senseMarginTask(spec, solveBase + 3)];
    case "mixed-signal":
      return [adcQuantizeTask(spec, solveBase), bandgapTask(spec, solveBase + 3)];
  }
}

function task(spec: PaperSpec, slug: string, title: string, difficulty: Difficulty, category: string, description: string, skeleton: string, tests: string, solveCount: number): Task {
  return {
    slug,
    title,
    difficulty,
    category,
    solveCount,
    description: `# ${title}\n\n## Paper Context\n\n${spec.title}\n\n${description}`,
    skeleton,
    tests,
  };
}

function dnaOneHotTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "dna-one-hot-encoding", "DNA One-Hot Encoding", "easy", "Bioinformatics", "Encode DNA bases as A/C/G/T rows. Unknown bases should become all-zero rows.", `import numpy as np

def one_hot_dna(sequence):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_dna_one_hot_encoding():
    out = one_hot_dna("ACGTN")
    assert out.shape == (5, 4)
    np.testing.assert_array_equal(out[0], np.array([1, 0, 0, 0]))
    np.testing.assert_array_equal(out[3], np.array([0, 0, 0, 1]))
    np.testing.assert_array_equal(out[4], np.zeros(4))
    print("All tests passed!")`, solveCount);
}

function motifPositionsTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "motif-position-scan", "Motif Position Scan", "easy", "Bioinformatics", "Return every zero-based start index where a motif occurs, including overlapping matches.", `def motif_positions(sequence, motif):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_motif_position_scan():
    assert motif_positions("ACGACGAC", "ACG") == [0, 3]
    assert motif_positions("AAAA", "AA") == [0, 1, 2]
    assert motif_positions("GATTACA", "CCC") == []
    print("All tests passed!")`, solveCount);
}

function variantDeltaTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "variant-delta-score", "Variant Delta Score", "medium", "Variant Effects", "Score the change between reference and alternate prediction tracks as alternate minus reference.", `import numpy as np

def variant_delta_score(reference_scores, alternate_scores):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_variant_delta_score():
    ref = np.array([0.2, 0.5, 0.9])
    alt = np.array([0.1, 0.7, 0.4])
    delta = variant_delta_score(ref, alt)
    np.testing.assert_allclose(delta, np.array([-0.1, 0.2, -0.5]))
    assert delta.shape == ref.shape
    print("All tests passed!")`, solveCount);
}

function pileupChannelsTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "pileup-channel-counts", "Pileup Channel Counts", "medium", "Variant Effects", "Summarize read pileups by counting A/C/G/T observations per genomic position.", `import numpy as np

def pileup_channel_counts(pileup_rows):
    # pileup_rows is a list of equal-length strings over A/C/G/T/N
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_pileup_channel_counts():
    counts = pileup_channel_counts(["ACGT", "ACNT", "TCGT"])
    assert counts.shape == (4, 4)
    np.testing.assert_array_equal(counts[0], np.array([2, 0, 0, 1]))
    np.testing.assert_array_equal(counts[2], np.array([0, 0, 2, 0]))
    print("All tests passed!")`, solveCount);
}

function logNormalizeTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "log-normalize-counts", "Log Normalize Counts", "easy", "Single Cell", "Normalize each cell to a fixed library size, then apply log1p.", `import numpy as np

def log_normalize_counts(counts, scale=10000.0):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_log_normalize_counts():
    counts = np.array([[1, 1, 2], [0, 3, 3]], dtype=float)
    out = log_normalize_counts(counts, scale=6.0)
    assert out.shape == counts.shape
    np.testing.assert_allclose(out[0], np.log1p(np.array([1.5, 1.5, 3.0])))
    np.testing.assert_allclose(out[1], np.log1p(np.array([0.0, 3.0, 3.0])))
    print("All tests passed!")`, solveCount);
}

function topVariableGenesTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "top-variable-genes", "Top Variable Genes", "easy", "Single Cell", "Return the column indices of the top-k most variable genes.", `import numpy as np

def top_variable_genes(expression, k):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_top_variable_genes():
    x = np.array([[1, 2, 10], [1, 5, 0], [1, 8, 5]], dtype=float)
    assert top_variable_genes(x, 2) == [2, 1]
    print("All tests passed!")`, solveCount);
}

function diceScoreTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "dice-segmentation-score", "Dice Segmentation Score", "easy", "Imaging", "Compute the Dice score for two binary masks.", `import numpy as np

def dice_score(mask_true, mask_pred):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_dice_segmentation_score():
    a = np.array([[1, 1, 0], [0, 1, 0]])
    b = np.array([[1, 0, 0], [0, 1, 1]])
    assert abs(dice_score(a, b) - (4 / 6)) < 1e-8
    assert dice_score(np.zeros((2, 2)), np.zeros((2, 2))) == 1.0
    print("All tests passed!")`, solveCount);
}

function boundingBoxesTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "mask-bounding-box", "Mask Bounding Box", "easy", "Visualization", "Return the bounding box around nonzero mask pixels as row_min, col_min, row_max, col_max.", `import numpy as np

def mask_bounding_box(mask):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_mask_bounding_box():
    mask = np.array([[0, 0, 0], [0, 1, 1], [0, 0, 1]])
    assert mask_bounding_box(mask) == (1, 1, 2, 2)
    assert mask_bounding_box(np.zeros((3, 3))) is None
    print("All tests passed!")`, solveCount);
}

function distanceMatrixTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "pairwise-distance-matrix", "Pairwise Distance Matrix", "easy", "Structure", "Compute all pairwise Euclidean distances for atom or residue coordinates.", `import numpy as np

def pairwise_distance_matrix(coords):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_pairwise_distance_matrix():
    coords = np.array([[0, 0, 0], [3, 4, 0], [0, 0, 12]], dtype=float)
    d = pairwise_distance_matrix(coords)
    assert d.shape == (3, 3)
    np.testing.assert_allclose(np.diag(d), 0)
    assert abs(d[0, 1] - 5.0) < 1e-8
    np.testing.assert_allclose(d, d.T)
    print("All tests passed!")`, solveCount);
}

function contactPairsTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "contact-pairs-below-cutoff", "Contact Pairs Below Cutoff", "medium", "Structure", "List residue or atom pairs whose distance is under a cutoff.", `import numpy as np

def contact_pairs(distances, cutoff):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_contact_pairs_below_cutoff():
    d = np.array([[0, 2, 5], [2, 0, 3], [5, 3, 0]], dtype=float)
    assert contact_pairs(d, 3.1) == [(0, 1), (1, 2)]
    print("All tests passed!")`, solveCount);
}

function jukesCantorTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "jukes-cantor-distance", "Jukes-Cantor Distance", "medium", "Phylogeny", "Compute the Jukes-Cantor corrected distance from a mismatch fraction p.", `import numpy as np

def jukes_cantor_distance(p):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_jukes_cantor_distance():
    assert abs(jukes_cantor_distance(0.0) - 0.0) < 1e-8
    expected = -0.75 * np.log(1 - 4 * 0.1 / 3)
    assert abs(jukes_cantor_distance(0.1) - expected) < 1e-8
    print("All tests passed!")`, solveCount);
}

function nearestPairTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "nearest-distance-pair", "Nearest Distance Pair", "easy", "Phylogeny", "Find the closest pair in a symmetric distance matrix, ignoring the diagonal.", `import numpy as np

def nearest_distance_pair(distances):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_nearest_distance_pair():
    d = np.array([[0, 5, 2], [5, 0, 1], [2, 1, 0]], dtype=float)
    assert nearest_distance_pair(d) == (1, 2)
    print("All tests passed!")`, solveCount);
}

function smilesTokenTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "smiles-tokenizer", "SMILES Tokenizer", "easy", "Cheminformatics", "Tokenize common one- and two-character SMILES atom symbols.", `def tokenize_smiles(smiles):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_smiles_tokenizer():
    assert tokenize_smiles("CCO") == ["C", "C", "O"]
    assert tokenize_smiles("ClCBr") == ["Cl", "C", "Br"]
    print("All tests passed!")`, solveCount);
}

function formulaCountTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "molecular-formula-counts", "Molecular Formula Counts", "easy", "Cheminformatics", "Count atom tokens in a tokenized molecule.", `def molecular_formula_counts(tokens):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_molecular_formula_counts():
    counts = molecular_formula_counts(["C", "C", "O", "H", "H"])
    assert counts == {"C": 2, "H": 2, "O": 1}
    print("All tests passed!")`, solveCount);
}

function degreeVectorTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "molecular-degree-vector", "Molecular Degree Vector", "easy", "Molecular Graphs", "Compute each atom degree from an adjacency matrix.", `import numpy as np

def molecular_degree_vector(adjacency):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_molecular_degree_vector():
    A = np.array([[0, 1, 1], [1, 0, 0], [1, 0, 0]])
    np.testing.assert_array_equal(molecular_degree_vector(A), np.array([2, 1, 1]))
    print("All tests passed!")`, solveCount);
}

function graphReadoutTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "graph-sum-readout", "Graph Sum Readout", "easy", "Molecular Graphs", "Sum-pool atom features into one molecule-level vector.", `import numpy as np

def graph_sum_readout(atom_features):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_graph_sum_readout():
    X = np.array([[1, 0, 2], [0, 1, 3]])
    np.testing.assert_array_equal(graph_sum_readout(X), np.array([1, 1, 5]))
    print("All tests passed!")`, solveCount);
}

function rmsdTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "pose-rmsd", "Pose RMSD", "medium", "Docking", "Compute RMSD between two ligand poses with matching atom order.", `import numpy as np

def pose_rmsd(reference_xyz, predicted_xyz):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_pose_rmsd():
    ref = np.array([[0, 0, 0], [1, 0, 0]], dtype=float)
    pred = np.array([[0, 0, 0], [2, 0, 0]], dtype=float)
    assert abs(pose_rmsd(ref, pred) - np.sqrt(0.5)) < 1e-8
    print("All tests passed!")`, solveCount);
}

function poseScoreTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "contact-pose-score", "Contact Pose Score", "easy", "Docking", "Score a docking pose by summing inverse distances for contacts under a cutoff.", `import numpy as np

def contact_pose_score(distances, cutoff=4.0):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_contact_pose_score():
    d = np.array([2.0, 5.0, 4.0])
    assert abs(contact_pose_score(d, cutoff=4.0) - (1 / 2 + 1 / 4)) < 1e-8
    print("All tests passed!")`, solveCount);
}

function coulombMatrixTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "coulomb-matrix", "Coulomb Matrix", "medium", "Quantum Chemistry", "Construct a simple Coulomb matrix from nuclear charges and coordinates.", `import numpy as np

def coulomb_matrix(charges, coords):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_coulomb_matrix():
    charges = np.array([1.0, 8.0])
    coords = np.array([[0, 0, 0], [0, 0, 2]], dtype=float)
    C = coulomb_matrix(charges, coords)
    assert C.shape == (2, 2)
    assert abs(C[0, 1] - 4.0) < 1e-8
    np.testing.assert_allclose(C, C.T)
    print("All tests passed!")`, solveCount);
}

function radialBasisTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "gaussian-radial-basis", "Gaussian Radial Basis", "medium", "Quantum Chemistry", "Expand distances with Gaussian radial basis functions.", `import numpy as np

def gaussian_radial_basis(distances, centers, gamma=1.0):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_gaussian_radial_basis():
    out = gaussian_radial_basis(np.array([0.0, 1.0]), np.array([0.0, 1.0]), gamma=1.0)
    assert out.shape == (2, 2)
    np.testing.assert_allclose(out[0], np.array([1.0, np.exp(-1.0)]))
    print("All tests passed!")`, solveCount);
}

function valenceValidityTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "valence-validity-check", "Valence Validity Check", "easy", "Generative Chemistry", "Return True if every atom degree is within its valence limit.", `import numpy as np

def valence_validity(adjacency, atoms, valence_limits):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_valence_validity_check():
    A = np.array([[0, 1, 1], [1, 0, 0], [1, 0, 0]])
    assert valence_validity(A, ["O", "H", "H"], {"O": 2, "H": 1}) is True
    assert valence_validity(A, ["H", "H", "H"], {"H": 1}) is False
    print("All tests passed!")`, solveCount);
}

function noveltyTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "molecule-novelty-score", "Molecule Novelty Score", "easy", "Generative Chemistry", "Compute the fraction of generated molecules not present in the training set.", `def molecule_novelty_score(generated, training):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_molecule_novelty_score():
    assert abs(molecule_novelty_score(["CCO", "CCC", "NCC"], {"CCO"}) - (2 / 3)) < 1e-8
    assert molecule_novelty_score([], {"CCO"}) == 0.0
    print("All tests passed!")`, solveCount);
}

function reactionBalanceTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "reaction-atom-balance", "Reaction Atom Balance", "medium", "Reactions", "Check whether reactant and product atom-count dictionaries match exactly.", `def reaction_atom_balance(reactants, products):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_reaction_atom_balance():
    assert reaction_atom_balance({"C": 1, "O": 2}, {"C": 1, "O": 2}) is True
    assert reaction_atom_balance({"C": 1, "O": 1}, {"C": 1, "O": 2}) is False
    print("All tests passed!")`, solveCount);
}

function yieldRankTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "rank-reaction-yields", "Rank Reaction Yields", "easy", "Reactions", "Return reaction ids sorted by predicted yield descending.", `def rank_reaction_yields(reaction_ids, yields):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_rank_reaction_yields():
    assert rank_reaction_yields(["r1", "r2", "r3"], [0.3, 0.9, 0.4]) == ["r2", "r3", "r1"]
    print("All tests passed!")`, solveCount);
}

function foldFingerprintTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "fold-fingerprint", "Fold Fingerprint", "medium", "Fingerprints", "Fold sparse integer identifiers into a fixed-length binary fingerprint.", `import numpy as np

def fold_fingerprint(identifiers, length):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_fold_fingerprint():
    fp = fold_fingerprint([1, 5, 9], 4)
    np.testing.assert_array_equal(fp, np.array([0, 1, 0, 0]))
    fp2 = fold_fingerprint([2, 3], 4)
    np.testing.assert_array_equal(fp2, np.array([0, 0, 1, 1]))
    print("All tests passed!")`, solveCount);
}

function tanimotoTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "tanimoto-similarity", "Tanimoto Similarity", "easy", "Fingerprints", "Compute Tanimoto similarity for binary fingerprints.", `import numpy as np

def tanimoto_similarity(fp_a, fp_b):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_tanimoto_similarity():
    a = np.array([1, 1, 0, 0])
    b = np.array([1, 0, 1, 0])
    assert abs(tanimoto_similarity(a, b) - (1 / 3)) < 1e-8
    assert tanimoto_similarity(np.zeros(3), np.zeros(3)) == 1.0
    print("All tests passed!")`, solveCount);
}

function ybusTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "build-ybus", "Build Y-Bus Matrix", "medium", "Power Systems", "Build a bus-admittance matrix from undirected line admittances.", `import numpy as np

def build_ybus(num_buses, lines):
    # lines are (i, j, admittance)
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_build_ybus():
    Y = build_ybus(3, [(0, 1, 2.0), (1, 2, 3.0)])
    expected = np.array([[2, -2, 0], [-2, 5, -3], [0, -3, 3]], dtype=float)
    np.testing.assert_allclose(Y, expected)
    print("All tests passed!")`, solveCount);
}

function dcPowerFlowTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "dc-power-flow", "DC Power Flow", "medium", "Power Systems", "Solve reduced B theta = P and return voltage angles with slack angle fixed to zero.", `import numpy as np

def dc_power_flow(B, injections, slack=0):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_dc_power_flow():
    B = np.array([[2, -2], [-2, 2]], dtype=float)
    theta = dc_power_flow(B, np.array([1.0, -1.0]), slack=0)
    assert theta.shape == (2,)
    assert abs(theta[0]) < 1e-8
    assert abs(theta[1] + 0.5) < 1e-8
    print("All tests passed!")`, solveCount);
}

function pidTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "pid-controller-step", "PID Controller Step", "easy", "Control", "Compute one PID control output from proportional, integral, and derivative terms.", `def pid_step(error, prev_error, integral, kp, ki, kd, dt):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_pid_controller_step():
    u, new_integral = pid_step(2.0, 1.0, 3.0, kp=1.0, ki=0.5, kd=0.25, dt=2.0)
    assert abs(new_integral - 7.0) < 1e-8
    assert abs(u - (2.0 + 3.5 + 0.125)) < 1e-8
    print("All tests passed!")`, solveCount);
}

function stateFeedbackTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "state-feedback-control", "State Feedback Control", "easy", "Control", "Compute u = -Kx for a linear state-feedback controller.", `import numpy as np

def state_feedback_control(K, x):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_state_feedback_control():
    K = np.array([[1.0, 2.0]])
    x = np.array([3.0, -1.0])
    np.testing.assert_allclose(state_feedback_control(K, x), np.array([-1.0]))
    print("All tests passed!")`, solveCount);
}

function convolutionTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "discrete-convolution", "Discrete Convolution", "easy", "Signals", "Implement one-dimensional linear convolution.", `import numpy as np

def discrete_convolution(x, h):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_discrete_convolution():
    np.testing.assert_array_equal(discrete_convolution(np.array([1, 2]), np.array([1, 1, 1])), np.array([1, 3, 3, 2]))
    print("All tests passed!")`, solveCount);
}

function phasorTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "phasor-components", "Phasor Components", "medium", "Signals", "Return magnitude and phase for a complex phasor.", `import numpy as np

def phasor_components(real, imag):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_phasor_components():
    mag, phase = phasor_components(3.0, 4.0)
    assert abs(mag - 5.0) < 1e-8
    assert abs(phase - np.arctan2(4.0, 3.0)) < 1e-8
    print("All tests passed!")`, solveCount);
}

function dqTransformTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "park-dq-transform", "Park dq Transform", "medium", "Machines", "Convert alpha-beta components into rotating d-q coordinates.", `import numpy as np

def park_dq_transform(alpha, beta, theta):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_park_dq_transform():
    d, q = park_dq_transform(1.0, 0.0, np.pi / 2)
    assert abs(d) < 1e-8
    assert abs(q + 1.0) < 1e-8
    print("All tests passed!")`, solveCount);
}

function slipTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "induction-machine-slip", "Induction Machine Slip", "easy", "Machines", "Compute slip from synchronous and rotor speeds.", `def induction_machine_slip(sync_speed, rotor_speed):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_induction_machine_slip():
    assert abs(induction_machine_slip(1800, 1746) - 0.03) < 1e-8
    print("All tests passed!")`, solveCount);
}

function mpptTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "perturb-observe-mppt", "Perturb and Observe MPPT", "medium", "Renewable Energy", "Choose the next duty-cycle direction from previous and current PV power.", `def perturb_observe_mppt(prev_power, power, prev_duty, step=0.01):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_perturb_observe_mppt():
    assert abs(perturb_observe_mppt(10, 12, 0.5, step=0.02) - 0.52) < 1e-8
    assert abs(perturb_observe_mppt(12, 10, 0.5, step=0.02) - 0.48) < 1e-8
    print("All tests passed!")`, solveCount);
}

function droopTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "frequency-droop", "Frequency Droop", "easy", "Microgrids", "Compute inverter frequency from nominal frequency and active-power deviation.", `def frequency_droop(f_nominal, p_measured, p_setpoint, droop_gain):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_frequency_droop():
    assert abs(frequency_droop(60.0, 1.2, 1.0, 0.5) - 59.9) < 1e-8
    print("All tests passed!")`, solveCount);
}

function rcLowpassTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "rc-lowpass-step", "RC Low-Pass Step", "medium", "Filters", "Simulate a first-order RC low-pass filter for one time step.", `import numpy as np

def rc_lowpass_step(v_prev, v_in, dt, tau):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_rc_lowpass_step():
    out = rc_lowpass_step(0.0, 1.0, dt=0.1, tau=0.2)
    assert abs(out - 0.5) < 1e-8
    print("All tests passed!")`, solveCount);
}

function cutoffTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "rc-cutoff-frequency", "RC Cutoff Frequency", "easy", "Filters", "Compute the -3 dB cutoff frequency of an RC filter.", `import numpy as np

def rc_cutoff_frequency(R, C):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_rc_cutoff_frequency():
    assert abs(rc_cutoff_frequency(1000, 1e-6) - (1 / (2 * np.pi * 0.001))) < 1e-8
    print("All tests passed!")`, solveCount);
}

function muxTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "mux4", "4-to-1 Multiplexer", "easy", "HDLBits Logic", "Implement a 4-input mux using a two-bit select value.", `def mux4(inputs, sel):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_mux4():
    assert mux4([10, 20, 30, 40], 0) == 10
    assert mux4([10, 20, 30, 40], 3) == 40
    print("All tests passed!")`, solveCount);
}

function truthTableTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "truth-table-from-lut", "Truth Table from LUT", "medium", "HDLBits Logic", "Return output bits for every input index of an n-input LUT.", `def truth_table_from_lut(lut, n_inputs):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_truth_table_from_lut():
    assert truth_table_from_lut(0b1000, 2) == [0, 0, 0, 1]
    assert truth_table_from_lut(0b0110, 2) == [0, 1, 1, 0]
    print("All tests passed!")`, solveCount);
}

function dffTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "dff-next-state", "D Flip-Flop Next State", "easy", "Sequential Logic", "Return the next q for a D flip-flop with enable and reset.", `def dff_next_state(q, d, enable=True, reset=False):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_dff_next_state():
    assert dff_next_state(1, 0, enable=True, reset=False) == 0
    assert dff_next_state(1, 0, enable=False, reset=False) == 1
    assert dff_next_state(1, 1, reset=True) == 0
    print("All tests passed!")`, solveCount);
}

function fsmTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "fsm-transition", "FSM Transition", "medium", "Sequential Logic", "Implement a small valid/ready detector FSM.", `def fsm_transition(state, valid, ready):
    # states: "IDLE", "BUSY", "DONE"
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_fsm_transition():
    assert fsm_transition("IDLE", True, False) == "BUSY"
    assert fsm_transition("BUSY", True, True) == "DONE"
    assert fsm_transition("DONE", False, False) == "IDLE"
    print("All tests passed!")`, solveCount);
}

function dynamicPowerTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "cmos-dynamic-power", "CMOS Dynamic Power", "easy", "CMOS", "Compute dynamic switching power alpha*C*V^2*f.", `def cmos_dynamic_power(activity, capacitance, voltage, frequency):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_cmos_dynamic_power():
    assert abs(cmos_dynamic_power(0.5, 2e-12, 1.0, 1e9) - 0.001) < 1e-12
    print("All tests passed!")`, solveCount);
}

function inverterTripTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "inverter-trip-point", "Inverter Trip Point Estimate", "medium", "CMOS", "Estimate inverter trip point from nMOS and pMOS strength factors.", `import numpy as np

def inverter_trip_point(vdd, beta_n, beta_p):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_inverter_trip_point():
    assert abs(inverter_trip_point(1.0, 1.0, 1.0) - 0.5) < 1e-8
    assert inverter_trip_point(1.0, 4.0, 1.0) < 0.5
    print("All tests passed!")`, solveCount);
}

function gainDbTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "gain-db", "Voltage Gain in dB", "easy", "Analog", "Convert voltage gain magnitude to decibels.", `import numpy as np

def gain_db(gain):
    # YOUR CODE HERE
    raise NotImplementedError`, `import numpy as np

def test_gain_db():
    assert abs(gain_db(10.0) - 20.0) < 1e-8
    assert abs(gain_db(1.0)) < 1e-8
    print("All tests passed!")`, solveCount);
}

function slewTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "slew-limited-step", "Slew-Limited Step", "medium", "Analog", "Limit output movement by slew_rate * dt.", `def slew_limited_step(v_prev, v_target, slew_rate, dt):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_slew_limited_step():
    assert abs(slew_limited_step(0, 10, 2, 1) - 2) < 1e-8
    assert abs(slew_limited_step(5, 0, 10, 1) - 0) < 1e-8
    print("All tests passed!")`, solveCount);
}

function wirelengthTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "manhattan-wirelength", "Manhattan Wirelength", "easy", "VLSI", "Compute total Manhattan length along a routed polyline.", `def manhattan_wirelength(points):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_manhattan_wirelength():
    assert manhattan_wirelength([(0, 0), (3, 0), (3, 4)]) == 7
    print("All tests passed!")`, solveCount);
}

function criticalPathTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "critical-path-delay", "Critical Path Delay", "easy", "VLSI", "Return the maximum path delay from a list of path-delay values.", `def critical_path_delay(path_delays):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_critical_path_delay():
    assert critical_path_delay([1.2, 3.5, 2.1]) == 3.5
    print("All tests passed!")`, solveCount);
}

function rv32DecodeTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "rv32i-field-decode", "RV32I Field Decode", "medium", "Processor", "Decode opcode, rd, funct3, rs1, rs2, and funct7 fields from a 32-bit instruction.", `def decode_rv32i_fields(inst):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_rv32i_field_decode():
    fields = decode_rv32i_fields(0x00B50533)
    assert fields["opcode"] == 0x33
    assert fields["rd"] == 10
    assert fields["rs1"] == 10
    assert fields["rs2"] == 11
    print("All tests passed!")`, solveCount);
}

function aluTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "tiny-alu", "Tiny ALU", "easy", "Processor", "Implement ADD, SUB, AND, OR operations.", `def tiny_alu(op, a, b):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_tiny_alu():
    assert tiny_alu("ADD", 2, 3) == 5
    assert tiny_alu("SUB", 2, 3) == -1
    assert tiny_alu("AND", 6, 3) == 2
    assert tiny_alu("OR", 6, 3) == 7
    print("All tests passed!")`, solveCount);
}

function memristorTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "memristor-state-update", "Memristor State Update", "medium", "Memory Devices", "Update a bounded memristor state with a current-driven drift term.", `def memristor_state_update(state, current, dt, mobility):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_memristor_state_update():
    assert abs(memristor_state_update(0.5, 2.0, 0.1, 0.5) - 0.6) < 1e-8
    assert memristor_state_update(0.99, 10, 1, 1) == 1.0
    print("All tests passed!")`, solveCount);
}

function senseMarginTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "memory-sense-margin", "Memory Sense Margin", "easy", "Memory Devices", "Compute read sense margin between high and low resistance states.", `def memory_sense_margin(r_high, r_low, read_voltage):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_memory_sense_margin():
    margin = memory_sense_margin(1000.0, 500.0, 1.0)
    assert abs(margin - 0.001) < 1e-12
    print("All tests passed!")`, solveCount);
}

function adcQuantizeTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "adc-quantize", "ADC Quantize", "easy", "Mixed Signal", "Quantize an input voltage to an unsigned ADC code.", `def adc_quantize(vin, vref, bits):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_adc_quantize():
    assert adc_quantize(0.5, 1.0, 2) == 2
    assert adc_quantize(2.0, 1.0, 3) == 7
    assert adc_quantize(-1.0, 1.0, 3) == 0
    print("All tests passed!")`, solveCount);
}

function bandgapTask(spec: PaperSpec, solveCount: number): Task {
  return task(spec, "bandgap-reference-output", "Bandgap Reference Output", "medium", "Mixed Signal", "Combine CTAT and PTAT terms into a reference voltage.", `def bandgap_reference_output(vbe, delta_vbe, gain):
    # YOUR CODE HERE
    raise NotImplementedError`, `def test_bandgap_reference_output():
    assert abs(bandgap_reference_output(0.7, 0.026, 20) - 1.22) < 1e-8
    print("All tests passed!")`, solveCount);
}
