import type { FundTopic } from "./fundamentals";

export const domainFundamentalsTopics: FundTopic[] = [
  {
    slug: "sequence-alignment",
    subject: "biology",
    title: "Sequence Alignment",
    year: 2026,
    authors: ["PaperCode Team"],
    category: "BIOLOGY",
    description:
      "Implement the string and dynamic-programming primitives behind DNA, RNA, and protein sequence comparison.",
    realWorldUse:
      "Sequence alignment shows up in clinical variant annotation, pathogen surveillance, primer design, ancestry analysis, and protein homology search. These small algorithms are the base layer for tools like BLAST-style search, viral lineage tracking, and genome quality-control pipelines.",
    systems: ["Clinical genomics", "Pathogen surveillance", "Protein homology search"],
    tasks: [
      {
        slug: "gc-content",
        title: "GC Content",
        shortDescription: "Measure the percentage of G and C bases in a DNA sequence.",
        difficulty: "easy",
        category: "Bioinformatics",
        whyImplement:
          "GC content is used in sequencing QC, primer design, and genome characterization because GC-rich regions behave differently during amplification and alignment.",
        description: `# GC Content

## Task
Implement gc_content(sequence), returning the percentage of bases that are G or C.

## Real-World Context
Sequencing platforms and primer design tools use GC content as a fast quality signal. Very high or low GC regions can be harder to amplify, assemble, or map.

Ignore whitespace and treat lowercase letters as valid bases.`,
        skeleton: `def gc_content(sequence):
    """Return GC percentage for a DNA sequence."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_gc_content():
    assert abs(gc_content("AGCTATAG") - 37.5) < 1e-9
    assert abs(gc_content("ggcc") - 100.0) < 1e-9
    assert gc_content("") == 0.0
    print("All tests passed!")`,
      },
      {
        slug: "hamming-distance",
        title: "Hamming Distance",
        shortDescription: "Count mismatches between equal-length biological sequences.",
        difficulty: "easy",
        category: "Bioinformatics",
        whyImplement:
          "Mismatch counting is a core step in barcode demultiplexing, mutation scans, and quick sequence similarity filters.",
        description: `# Hamming Distance

## Task
Implement hamming_distance(a, b), returning how many aligned positions differ.

## Real-World Context
Sequencing pipelines compare reads, sample barcodes, and candidate variants with simple mismatch counts before using more expensive alignment methods.

Raise ValueError when the sequences have different lengths.`,
        skeleton: `def hamming_distance(a, b):
    """Return the number of mismatched positions."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_hamming_distance():
    assert hamming_distance("GATTACA", "GACTATA") == 2
    assert hamming_distance("AAAA", "AAAA") == 0
    try:
        hamming_distance("ACG", "AC")
        assert False, "Expected ValueError"
    except ValueError:
        pass
    print("All tests passed!")`,
      },
      {
        slug: "global-alignment-score",
        title: "Global Alignment Score",
        shortDescription: "Use dynamic programming to score a whole-sequence alignment.",
        difficulty: "medium",
        category: "Dynamic Programming",
        whyImplement:
          "Global alignment is the algorithmic core behind comparing complete genes, protein domains, and consensus sequences.",
        description: `# Global Alignment Score

## Task
Implement global_alignment_score(a, b, match=1, mismatch=-1, gap=-1).

Return only the best alignment score, not the aligned strings.

## Real-World Context
The Needleman-Wunsch dynamic program is a building block for gene comparison, protein family analysis, and reference-guided sequence review.`,
        skeleton: `def global_alignment_score(a, b, match=1, mismatch=-1, gap=-1):
    """Return the best global alignment score."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_global_alignment_score():
    assert global_alignment_score("A", "A") == 1
    assert global_alignment_score("AG", "AC") == 0
    assert global_alignment_score("AG", "A", match=2, mismatch=-1, gap=-2) == 0
    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "gene-expression",
    subject: "biology",
    title: "Gene Expression",
    year: 2026,
    authors: ["PaperCode Team"],
    category: "BIOLOGY",
    description:
      "Build the normalization and ranking utilities used to compare expression across cells, tissues, and experiments.",
    realWorldUse:
      "Expression analysis powers single-cell atlases, cancer subtype discovery, biomarker search, perturbation screens, and drug-response studies. These implementations teach why normalization and fold-change calculations matter before model training.",
    systems: ["Single-cell analysis", "Biomarker discovery", "Drug-response studies"],
    tasks: [
      {
        slug: "counts-per-million",
        title: "Counts Per Million",
        shortDescription: "Normalize raw gene counts into comparable expression rates.",
        difficulty: "easy",
        category: "Normalization",
        whyImplement:
          "CPM normalization lets labs compare samples with different sequencing depths before differential-expression analysis.",
        description: `# Counts Per Million

## Task
Implement counts_per_million(counts), returning a list where each count is divided by the total and multiplied by 1,000,000.

## Real-World Context
RNA-seq and single-cell pipelines normalize reads because two samples can have different library sizes even when the biology is similar.`,
        skeleton: `def counts_per_million(counts):
    """Return counts normalized to counts per million."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_counts_per_million():
    out = counts_per_million([10, 30, 60])
    assert [round(x) for x in out] == [100000, 300000, 600000]
    assert counts_per_million([0, 0]) == [0, 0]
    print("All tests passed!")`,
      },
      {
        slug: "log2-fold-change",
        title: "Log2 Fold Change",
        shortDescription: "Compare treated and control expression with a stable ratio.",
        difficulty: "easy",
        category: "Differential Expression",
        whyImplement:
          "Log fold change is a standard effect-size measure in experiments that compare disease, treatment, and control cohorts.",
        description: `# Log2 Fold Change

## Task
Implement log2_fold_change(treated, control, pseudocount=1.0).

Return log2((treated + pseudocount) / (control + pseudocount)).

## Real-World Context
Differential-expression reports use fold change to rank genes that move under a treatment, mutation, or cell-state shift.`,
        skeleton: `import math

def log2_fold_change(treated, control, pseudocount=1.0):
    """Return a stable log2 fold change."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_log2_fold_change():
    assert abs(log2_fold_change(7, 1, 1) - 2.0) < 1e-9
    assert abs(log2_fold_change(0, 0, 1)) < 1e-9
    print("All tests passed!")`,
      },
      {
        slug: "top-marker-genes",
        title: "Top Marker Genes",
        shortDescription: "Rank genes by a marker score and return the strongest hits.",
        difficulty: "easy",
        category: "Ranking",
        whyImplement:
          "Marker-gene ranking is used to label cell types, summarize clusters, and decide which genes deserve follow-up validation.",
        description: `# Top Marker Genes

## Task
Implement top_marker_genes(genes, scores, k), returning the k gene names with the largest scores.

## Real-World Context
Single-cell dashboards and biomarker tools surface marker genes so researchers can understand clusters and experimental conditions quickly.`,
        skeleton: `def top_marker_genes(genes, scores, k):
    """Return the names of the top k genes by score."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_top_marker_genes():
    genes = ["ACTB", "CD3D", "MS4A1", "NKG7"]
    scores = [0.1, 2.4, 1.8, 3.2]
    assert top_marker_genes(genes, scores, 2) == ["NKG7", "CD3D"]
    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "protein-structure",
    subject: "biology",
    title: "Protein Structure",
    year: 2026,
    authors: ["PaperCode Team"],
    category: "BIOLOGY",
    description:
      "Implement geometric measures used to compare and evaluate protein structures.",
    realWorldUse:
      "Distance matrices, contact maps, and RMSD scores are used in protein folding, docking validation, enzyme engineering, antibody design, and structural biology review tools.",
    systems: ["Protein folding", "Drug docking", "Structure validation"],
    tasks: [
      {
        slug: "euclidean-distance",
        title: "3D Euclidean Distance",
        shortDescription: "Compute distance between two atoms in three-dimensional space.",
        difficulty: "easy",
        category: "Geometry",
        whyImplement:
          "Atom distances are the raw material for contact maps, binding-site analysis, and structural clash detection.",
        description: `# 3D Euclidean Distance

## Task
Implement euclidean_distance(a, b), where a and b are 3D coordinate tuples.

## Real-World Context
Structural biology tools compute millions of atom distances to detect contacts, clashes, and likely interaction sites.`,
        skeleton: `import math

def euclidean_distance(a, b):
    """Return the 3D distance between two points."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_euclidean_distance():
    assert abs(euclidean_distance((0, 0, 0), (3, 4, 0)) - 5.0) < 1e-9
    assert euclidean_distance((1, 2, 3), (1, 2, 3)) == 0
    print("All tests passed!")`,
      },
      {
        slug: "contact-pairs",
        title: "Contact Pairs",
        shortDescription: "Find residue or atom pairs close enough to be in contact.",
        difficulty: "medium",
        category: "Geometry",
        whyImplement:
          "Contact maps compress 3D structures into graph-like features used by folding models and docking validators.",
        description: `# Contact Pairs

## Task
Implement contact_pairs(coords, threshold), returning all index pairs (i, j) with i < j whose distance is at most threshold.

## Real-World Context
Protein-folding systems and docking tools use contact maps to reason about which residues are spatially close.`,
        skeleton: `import math

def contact_pairs(coords, threshold):
    """Return pairs of coordinate indices within threshold."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_contact_pairs():
    coords = [(0, 0, 0), (0, 0, 3), (10, 0, 0), (0, 4, 0)]
    assert contact_pairs(coords, 4.0) == [(0, 1), (0, 3)]
    print("All tests passed!")`,
      },
      {
        slug: "rmsd",
        title: "Structure RMSD",
        shortDescription: "Measure average coordinate deviation between two structures.",
        difficulty: "medium",
        category: "Structure Comparison",
        whyImplement:
          "RMSD is used to compare predicted structures, validate docking poses, and track molecular simulation drift.",
        description: `# Structure RMSD

## Task
Implement rmsd(reference, predicted), where each input is a list of 3D coordinates.

Return the square root of the mean squared atom distance.

## Real-World Context
Protein prediction and docking benchmarks report RMSD to quantify how close a model is to a trusted structure.`,
        skeleton: `import math

def rmsd(reference, predicted):
    """Return root mean squared deviation between coordinate lists."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_rmsd():
    ref = [(0, 0, 0), (1, 0, 0)]
    pred = [(0, 0, 0), (2, 0, 0)]
    assert abs(rmsd(ref, pred) - (0.5 ** 0.5)) < 1e-9
    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "variant-analysis",
    subject: "biology",
    title: "Variant Analysis",
    year: 2026,
    authors: ["PaperCode Team"],
    category: "BIOLOGY",
    description:
      "Build small parsers and counters used in human genetics and variant triage workflows.",
    realWorldUse:
      "Variant-analysis systems annotate changes, aggregate genotypes, prioritize suspicious mutations, and create auditable reports for clinicians, population geneticists, and lab scientists.",
    systems: ["Clinical variant triage", "Population genetics", "Genome reports"],
    tasks: [
      {
        slug: "parse-variant",
        title: "Parse Variant Notation",
        shortDescription: "Convert compact variant strings into structured fields.",
        difficulty: "easy",
        category: "Parsing",
        whyImplement:
          "Variant annotation pipelines need reliable structured coordinates before joining against gene, disease, and population databases.",
        description: `# Parse Variant Notation

## Task
Implement parse_variant(text), accepting strings like chr1:101:A:G.

Return a dictionary with chrom, pos, ref, and alt.

## Real-World Context
Clinical genomics tools parse variant identifiers before annotation, filtering, and report generation.`,
        skeleton: `def parse_variant(text):
    """Parse chrom:pos:ref:alt into a dictionary."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_parse_variant():
    out = parse_variant("chr1:101:A:G")
    assert out == {"chrom": "chr1", "pos": 101, "ref": "A", "alt": "G"}
    print("All tests passed!")`,
      },
      {
        slug: "genotype-counts",
        title: "Genotype Counts",
        shortDescription: "Count genotype strings across a cohort.",
        difficulty: "easy",
        category: "Cohorts",
        whyImplement:
          "Cohort dashboards summarize genotype counts before computing frequencies, associations, and quality filters.",
        description: `# Genotype Counts

## Task
Implement genotype_counts(genotypes), returning a dictionary of genotype string counts.

## Real-World Context
Population genetics and clinical cohort tools count genotypes to estimate variant frequency and quality-control signals.`,
        skeleton: `def genotype_counts(genotypes):
    """Return counts for genotype strings such as 0/0, 0/1, and 1/1."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_genotype_counts():
    assert genotype_counts(["0/0", "0/1", "0/1", "1/1"]) == {"0/0": 1, "0/1": 2, "1/1": 1}
    print("All tests passed!")`,
      },
      {
        slug: "pathogenicity-delta",
        title: "Pathogenicity Delta",
        shortDescription: "Measure how much an alternate allele changes a prediction score.",
        difficulty: "easy",
        category: "Scoring",
        whyImplement:
          "Delta scores help rank variants whose alternate allele may disrupt protein function, splicing, or regulation.",
        description: `# Pathogenicity Delta

## Task
Implement pathogenicity_delta(reference_score, alternate_score), returning alternate_score - reference_score.

## Real-World Context
Variant prioritization systems compare reference and alternate predictions to focus review on high-impact changes.`,
        skeleton: `def pathogenicity_delta(reference_score, alternate_score):
    """Return alternate minus reference score."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_pathogenicity_delta():
    assert abs(pathogenicity_delta(0.2, 0.9) - 0.7) < 1e-9
    assert abs(pathogenicity_delta(0.8, 0.5) + 0.3) < 1e-9
    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "molecular-representations",
    subject: "chemistry",
    title: "Molecular Representations",
    year: 2026,
    authors: ["PaperCode Team"],
    category: "CHEMISTRY",
    description:
      "Implement parsers and descriptors that turn chemical strings into computable structures.",
    realWorldUse:
      "Chemical informatics systems use molecular formulas and SMILES-like tokens for search, property prediction, inventory matching, and model-ready feature generation.",
    systems: ["Molecule search", "Property prediction", "Lab inventory systems"],
    tasks: [
      {
        slug: "formula-counts",
        title: "Formula Counts",
        shortDescription: "Parse a molecular formula into atom counts.",
        difficulty: "easy",
        category: "Parsing",
        whyImplement:
          "Formula parsing underpins molecular weight calculators, compound matching, and lab inventory validation.",
        description: `# Formula Counts

## Task
Implement formula_counts(formula), returning a dictionary of element counts.

Examples: H2O -> {"H": 2, "O": 1}, C6H12O6 -> {"C": 6, "H": 12, "O": 6}.

## Real-World Context
Chemistry platforms parse formulas before property calculation, search indexing, and reagent verification.`,
        skeleton: `import re

def formula_counts(formula):
    """Return element counts from a simple molecular formula."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_formula_counts():
    assert formula_counts("H2O") == {"H": 2, "O": 1}
    assert formula_counts("C6H12O6") == {"C": 6, "H": 12, "O": 6}
    print("All tests passed!")`,
      },
      {
        slug: "molecular-weight",
        title: "Molecular Weight",
        shortDescription: "Compute molecular weight from formula counts and atomic weights.",
        difficulty: "easy",
        category: "Descriptors",
        whyImplement:
          "Molecular weight is a basic descriptor used in screening filters, stoichiometry tools, and compound databases.",
        description: `# Molecular Weight

## Task
Implement molecular_weight(counts, weights), returning the weighted sum of atoms.

## Real-World Context
Compound registries and drug-discovery pipelines use molecular weight to filter molecules and validate formulas.`,
        skeleton: `def molecular_weight(counts, weights):
    """Return sum(count * atomic_weight)."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_molecular_weight():
    weights = {"H": 1.008, "O": 15.999, "C": 12.011}
    assert abs(molecular_weight({"H": 2, "O": 1}, weights) - 18.015) < 0.001
    print("All tests passed!")`,
      },
      {
        slug: "tokenize-smiles",
        title: "Tokenize SMILES",
        shortDescription: "Split a compact molecule string into meaningful atom and bond tokens.",
        difficulty: "medium",
        category: "Parsing",
        whyImplement:
          "SMILES tokenization is a first step for molecule search, graph construction, and chemistry language models.",
        description: `# Tokenize SMILES

## Task
Implement tokenize_smiles(smiles), keeping two-character elements like Cl and Br as one token.

## Real-World Context
Molecular machine-learning systems often begin by tokenizing SMILES strings before building graphs or sequence models.`,
        skeleton: `def tokenize_smiles(smiles):
    """Return a list of simple SMILES tokens."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_tokenize_smiles():
    assert tokenize_smiles("CCO") == ["C", "C", "O"]
    assert tokenize_smiles("ClCBr") == ["Cl", "C", "Br"]
    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "fingerprints-similarity",
    subject: "chemistry",
    title: "Fingerprints and Similarity",
    year: 2026,
    authors: ["PaperCode Team"],
    category: "CHEMISTRY",
    description:
      "Build binary molecular fingerprints and compare compounds with Tanimoto similarity.",
    realWorldUse:
      "Similarity search drives virtual screening, analog discovery, duplicate detection, and hit expansion in cheminformatics platforms.",
    systems: ["Virtual screening", "Analog search", "Compound clustering"],
    tasks: [
      {
        slug: "fold-fingerprint",
        title: "Fold Fingerprint",
        shortDescription: "Map sparse feature indices into a fixed-size binary vector.",
        difficulty: "easy",
        category: "Fingerprints",
        whyImplement:
          "Fixed-size fingerprints make molecule search and clustering fast enough for large compound libraries.",
        description: `# Fold Fingerprint

## Task
Implement fold_fingerprint(indices, size), returning a binary list of length size.

Set position index % size to 1 for each feature index.

## Real-World Context
Chemical search engines compress molecular substructure features into fingerprints for fast lookup.`,
        skeleton: `def fold_fingerprint(indices, size):
    """Return a folded binary fingerprint."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_fold_fingerprint():
    assert fold_fingerprint([0, 2, 5], 4) == [1, 1, 1, 0]
    print("All tests passed!")`,
      },
      {
        slug: "tanimoto-similarity",
        title: "Tanimoto Similarity",
        shortDescription: "Compare two binary fingerprints with intersection over union.",
        difficulty: "easy",
        category: "Similarity",
        whyImplement:
          "Tanimoto similarity is a standard score for finding molecules with similar substructures and likely related activity.",
        description: `# Tanimoto Similarity

## Task
Implement tanimoto_similarity(fp_a, fp_b).

For binary vectors, this is intersection_count / union_count. Return 0 when the union is empty.

## Real-World Context
Virtual-screening systems use Tanimoto similarity to retrieve analogs and cluster compounds.`,
        skeleton: `def tanimoto_similarity(fp_a, fp_b):
    """Return Tanimoto similarity for two binary fingerprints."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_tanimoto_similarity():
    assert tanimoto_similarity([1, 0, 1], [1, 1, 0]) == 1 / 3
    assert tanimoto_similarity([0, 0], [0, 0]) == 0
    print("All tests passed!")`,
      },
      {
        slug: "nearest-molecule",
        title: "Nearest Molecule",
        shortDescription: "Find the most similar molecule in a library of fingerprints.",
        difficulty: "medium",
        category: "Search",
        whyImplement:
          "Nearest-neighbor retrieval lets scientists find analogs for a new hit compound in seconds.",
        description: `# Nearest Molecule

## Task
Implement nearest_molecule(query, library), returning the index of the library fingerprint with the highest Tanimoto similarity.

## Real-World Context
Drug-discovery interfaces use nearest-neighbor search to suggest related compounds and prioritize follow-up chemistry.`,
        skeleton: `def tanimoto_similarity(fp_a, fp_b):
    intersection = sum(1 for a, b in zip(fp_a, fp_b) if a and b)
    union = sum(1 for a, b in zip(fp_a, fp_b) if a or b)
    return intersection / union if union else 0

def nearest_molecule(query, library):
    """Return index of most similar fingerprint."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_nearest_molecule():
    query = [1, 0, 1, 0]
    library = [[0, 1, 0, 1], [1, 0, 1, 1], [1, 0, 0, 0]]
    assert nearest_molecule(query, library) == 1
    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "reaction-analysis",
    subject: "chemistry",
    title: "Reaction Analysis",
    year: 2026,
    authors: ["PaperCode Team"],
    category: "CHEMISTRY",
    description:
      "Implement checks and rankings used to validate reactions and compare experimental outcomes.",
    realWorldUse:
      "Reaction informatics platforms check atom balance, monitor yields, rank conditions, and produce reproducible chemistry notebooks for optimization campaigns.",
    systems: ["Reaction planning", "Yield optimization", "Lab automation"],
    tasks: [
      {
        slug: "atom-balance",
        title: "Atom Balance",
        shortDescription: "Compare reactant and product atom totals.",
        difficulty: "easy",
        category: "Stoichiometry",
        whyImplement:
          "Atom-balance checks catch invalid reaction records before they enter search indexes or training datasets.",
        description: `# Atom Balance

## Task
Implement atom_balance(reactants, products), where each side is a list of atom-count dictionaries.

Return a dictionary product_count - reactant_count for each element.

## Real-World Context
Chemical ELNs and reaction databases validate reaction records before analytics or model training.`,
        skeleton: `def atom_balance(reactants, products):
    """Return product atom counts minus reactant atom counts."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_atom_balance():
    reactants = [{"H": 2}, {"O": 2}]
    products = [{"H": 2, "O": 1}]
    assert atom_balance(reactants, products) == {"H": 0, "O": -1}
    print("All tests passed!")`,
      },
      {
        slug: "is-balanced",
        title: "Balanced Reaction Check",
        shortDescription: "Return whether reactants and products preserve every atom count.",
        difficulty: "easy",
        category: "Stoichiometry",
        whyImplement:
          "Balanced-reaction checks keep automated planners and lab robots from following chemically impossible records.",
        description: `# Balanced Reaction Check

## Task
Implement is_balanced(reactants, products), returning True only when every atom count is unchanged.

## Real-World Context
Reaction-planning systems need quick validation before proposing synthesis steps.`,
        skeleton: `def is_balanced(reactants, products):
    """Return True if atom counts match on both sides."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_is_balanced():
    assert is_balanced([{"H": 2}, {"O": 1}], [{"H": 2, "O": 1}]) is True
    assert is_balanced([{"H": 2}, {"O": 2}], [{"H": 2, "O": 1}]) is False
    print("All tests passed!")`,
      },
      {
        slug: "rank-yields",
        title: "Rank Reaction Yields",
        shortDescription: "Sort experiments by observed yield.",
        difficulty: "easy",
        category: "Optimization",
        whyImplement:
          "Yield ranking helps chemists pick the best solvent, catalyst, or temperature condition from screening data.",
        description: `# Rank Reaction Yields

## Task
Implement rank_yields(experiments), returning experiment names sorted by yield descending.

Each experiment is a dictionary with name and yield keys.

## Real-World Context
Reaction-optimization dashboards rank conditions so scientists can decide what to try next.`,
        skeleton: `def rank_yields(experiments):
    """Return names sorted by yield from high to low."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_rank_yields():
    experiments = [{"name": "A", "yield": 41}, {"name": "B", "yield": 82}, {"name": "C", "yield": 60}]
    assert rank_yields(experiments) == ["B", "C", "A"]
    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "docking-energetics",
    subject: "chemistry",
    title: "Docking and Energetics",
    year: 2026,
    authors: ["PaperCode Team"],
    category: "CHEMISTRY",
    description:
      "Implement simple metrics used to rank ligand poses and normalize binding scores.",
    realWorldUse:
      "Docking workflows combine pose geometry, contact counts, and binding-energy normalization to triage molecules before expensive wet-lab testing.",
    systems: ["Drug docking", "Hit triage", "Lead optimization"],
    tasks: [
      {
        slug: "ligand-efficiency",
        title: "Ligand Efficiency",
        shortDescription: "Normalize binding energy by molecule size.",
        difficulty: "easy",
        category: "Scoring",
        whyImplement:
          "Ligand efficiency helps compare molecules fairly when larger compounds get better raw binding scores just because they have more atoms.",
        description: `# Ligand Efficiency

## Task
Implement ligand_efficiency(binding_energy, heavy_atoms), returning binding_energy / heavy_atoms.

## Real-World Context
Drug-discovery teams use ligand efficiency to avoid selecting oversized molecules with poor developability.`,
        skeleton: `def ligand_efficiency(binding_energy, heavy_atoms):
    """Return binding energy normalized by heavy atom count."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_ligand_efficiency():
    assert ligand_efficiency(-9.0, 30) == -0.3
    print("All tests passed!")`,
      },
      {
        slug: "pose-rmsd",
        title: "Pose RMSD",
        shortDescription: "Measure geometric deviation between two docked poses.",
        difficulty: "medium",
        category: "Geometry",
        whyImplement:
          "Pose RMSD helps decide whether a docking result matches a known binding mode or drifts into an unlikely orientation.",
        description: `# Pose RMSD

## Task
Implement pose_rmsd(reference, pose), where each input is a list of 3D coordinates.

## Real-World Context
Docking validators compare predicted ligand poses against crystal structures or trusted reference poses.`,
        skeleton: `import math

def pose_rmsd(reference, pose):
    """Return RMSD between two coordinate lists."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_pose_rmsd():
    ref = [(0, 0, 0), (1, 0, 0)]
    pose = [(0, 0, 0), (2, 0, 0)]
    assert abs(pose_rmsd(ref, pose) - (0.5 ** 0.5)) < 1e-9
    print("All tests passed!")`,
      },
      {
        slug: "contact-score",
        title: "Contact Score",
        shortDescription: "Score a pose by how many contacts fall within a cutoff.",
        difficulty: "easy",
        category: "Scoring",
        whyImplement:
          "Contact scores are simple explainable features for ranking poses and checking whether key pocket interactions are present.",
        description: `# Contact Score

## Task
Implement contact_score(distances, cutoff), returning how many distances are less than or equal to cutoff.

## Real-World Context
Docking dashboards often expose interaction counts so scientists can verify why a pose was ranked highly.`,
        skeleton: `def contact_score(distances, cutoff):
    """Return number of contacts within cutoff."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_contact_score():
    assert contact_score([2.1, 3.8, 5.0, 1.9], 4.0) == 3
    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "circuits-signals",
    subject: "electrical",
    title: "Circuits and Signals",
    year: 2026,
    authors: ["PaperCode Team"],
    category: "ELECTRICAL",
    description:
      "Implement basic circuit and signal calculations used in power electronics, sensing, and measurement systems.",
    realWorldUse:
      "RMS, impedance division, and RC response calculations appear in oscilloscopes, motor drives, battery systems, filters, and sensor front ends.",
    systems: ["Power electronics", "Sensor front ends", "Measurement tools"],
    tasks: [
      {
        slug: "rms-value",
        title: "RMS Value",
        shortDescription: "Compute root-mean-square amplitude for sampled signals.",
        difficulty: "easy",
        category: "Signals",
        whyImplement:
          "RMS converts time-varying voltage or current into an effective power-related value used by meters and protection systems.",
        description: `# RMS Value

## Task
Implement rms_value(samples), returning sqrt(mean(sample squared)).

## Real-World Context
Digital multimeters, power analyzers, and monitoring systems use RMS to summarize AC signals.`,
        skeleton: `import math

def rms_value(samples):
    """Return root-mean-square value."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_rms_value():
    assert abs(rms_value([1, -1, 1, -1]) - 1.0) < 1e-9
    assert abs(rms_value([3, 4]) - ((25 / 2) ** 0.5)) < 1e-9
    print("All tests passed!")`,
      },
      {
        slug: "impedance-divider",
        title: "Impedance Divider",
        shortDescription: "Calculate output voltage across the second impedance.",
        difficulty: "easy",
        category: "Circuits",
        whyImplement:
          "Impedance dividers are the mental model behind filters, sensor conditioning, and measurement loading.",
        description: `# Impedance Divider

## Task
Implement impedance_divider(z1, z2, vin), returning vin * z2 / (z1 + z2).

Inputs can be real or complex numbers.

## Real-World Context
Signal-conditioning circuits and filters rely on impedance division to set gain and frequency behavior.`,
        skeleton: `def impedance_divider(z1, z2, vin):
    """Return voltage across z2."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_impedance_divider():
    assert impedance_divider(1000, 1000, 5) == 2.5
    out = impedance_divider(1 + 1j, 1 - 1j, 10)
    assert abs(out - (5 - 5j)) < 1e-9
    print("All tests passed!")`,
      },
      {
        slug: "rc-step-response",
        title: "RC Step Response",
        shortDescription: "Model capacitor voltage after a step input.",
        difficulty: "medium",
        category: "Circuits",
        whyImplement:
          "RC response models are used in filters, timing circuits, debounce networks, and analog sensor interfaces.",
        description: `# RC Step Response

## Task
Implement rc_step_response(t, resistance, capacitance, vin), returning vin * (1 - exp(-t / (R*C))).

## Real-World Context
Embedded and analog systems use RC curves to predict settling time and filter behavior.`,
        skeleton: `import math

def rc_step_response(t, resistance, capacitance, vin):
    """Return capacitor voltage at time t after a step."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_rc_step_response():
    assert abs(rc_step_response(0, 1000, 0.001, 5)) < 1e-9
    expected = 5 * (1 - __import__("math").exp(-1))
    assert abs(rc_step_response(1.0, 1000, 0.001, 5) - expected) < 1e-9
    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "power-systems",
    subject: "electrical",
    title: "Power Systems",
    year: 2026,
    authors: ["PaperCode Team"],
    category: "ELECTRICAL",
    description:
      "Build the matrix and power calculations used to analyze grids and energy systems.",
    realWorldUse:
      "Power-flow and admittance calculations are used in grid planning, renewable integration, outage studies, microgrid controllers, and energy-management dashboards.",
    systems: ["Grid planning", "Microgrids", "Energy management"],
    tasks: [
      {
        slug: "complex-power",
        title: "Complex Power",
        shortDescription: "Calculate apparent power from voltage and current phasors.",
        difficulty: "easy",
        category: "Power",
        whyImplement:
          "Complex power separates real and reactive demand, which utilities need for billing, planning, and voltage control.",
        description: `# Complex Power

## Task
Implement complex_power(voltage, current), returning voltage * conjugate(current).

## Real-World Context
Grid monitors and protection relays estimate real and reactive power from phasor measurements.`,
        skeleton: `def complex_power(voltage, current):
    """Return complex power S = V * conjugate(I)."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_complex_power():
    assert complex_power(120 + 0j, 10 - 5j) == 1200 + 600j
    print("All tests passed!")`,
      },
      {
        slug: "build-ybus",
        title: "Build Y-Bus Matrix",
        shortDescription: "Assemble a bus admittance matrix from transmission lines.",
        difficulty: "medium",
        category: "Grid Models",
        whyImplement:
          "The Y-bus matrix is the shared data structure behind power-flow, fault, and stability studies.",
        description: `# Build Y-Bus Matrix

## Task
Implement build_ybus(lines, n), where each line is (from_bus, to_bus, impedance).

Return an n by n nested list of complex admittances.

## Real-World Context
Grid simulation tools assemble Y-bus matrices before solving network equations.`,
        skeleton: `def build_ybus(lines, n):
    """Return an n by n bus admittance matrix."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_build_ybus():
    ybus = build_ybus([(0, 1, 2 + 0j)], 2)
    assert ybus[0][0] == 0.5 + 0j
    assert ybus[1][1] == 0.5 + 0j
    assert ybus[0][1] == -0.5 + 0j
    print("All tests passed!")`,
      },
      {
        slug: "dc-power-flow",
        title: "DC Power Flow",
        shortDescription: "Solve reduced linearized power-flow angles.",
        difficulty: "medium",
        category: "Grid Models",
        whyImplement:
          "DC power flow is a fast approximation used in grid operations, planning tools, and market simulations.",
        description: `# DC Power Flow

## Task
Implement dc_power_flow(b_matrix, injections), assuming bus 0 is the slack bus.

Use the reduced matrix excluding bus 0, solve B_reduced * theta = injections_reduced, and return all angles with theta[0] = 0.

## Real-World Context
Grid operators and researchers use DC power flow for quick dispatch and congestion studies.`,
        skeleton: `import numpy as np

def dc_power_flow(b_matrix, injections):
    """Return voltage angles with bus 0 as slack."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `import numpy as np

def test_dc_power_flow():
    B = np.array([[10., -10.], [-10., 10.]])
    p = np.array([0., 5.])
    theta = dc_power_flow(B, p)
    assert len(theta) == 2
    assert abs(theta[0]) < 1e-12
    assert abs(theta[1] - 0.5) < 1e-9
    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "control-systems",
    subject: "electrical",
    title: "Control Systems",
    year: 2026,
    authors: ["PaperCode Team"],
    category: "ELECTRICAL",
    description:
      "Implement controller primitives used in robotics, industrial automation, and physical system regulation.",
    realWorldUse:
      "PID loops, state feedback, and stability margins appear in drones, motors, thermal systems, process plants, power converters, and robotics controllers.",
    systems: ["Robotics", "Motor control", "Industrial automation"],
    tasks: [
      {
        slug: "pid-update",
        title: "PID Update",
        shortDescription: "Compute one proportional-integral-derivative control step.",
        difficulty: "easy",
        category: "Control",
        whyImplement:
          "PID is the default control loop in many real machines because it is simple, tunable, and robust enough for countless actuators.",
        description: `# PID Update

## Task
Implement pid_update(error, integral, previous_error, kp, ki, kd, dt).

Return (control, new_integral).

## Real-World Context
Motor drives, heaters, drones, and process controllers use PID updates to reduce error over time.`,
        skeleton: `def pid_update(error, integral, previous_error, kp, ki, kd, dt):
    """Return one PID control output and updated integral."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_pid_update():
    u, integ = pid_update(2, 1, 1, 3, 0.5, 0.25, 0.1)
    assert abs(integ - 1.2) < 1e-9
    assert abs(u - 9.1) < 1e-9
    print("All tests passed!")`,
      },
      {
        slug: "state-feedback",
        title: "State Feedback",
        shortDescription: "Apply u = -Kx for a measured state vector.",
        difficulty: "easy",
        category: "Control",
        whyImplement:
          "State feedback is common in robotics and aerospace systems where controllers use measured state, not just scalar error.",
        description: `# State Feedback

## Task
Implement state_feedback(state, gains), returning -sum(gain_i * state_i).

## Real-World Context
Balancing robots, aircraft, and motion-control systems use state feedback to stabilize multi-variable dynamics.`,
        skeleton: `def state_feedback(state, gains):
    """Return scalar control input u = -Kx."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_state_feedback():
    assert state_feedback([2, -1], [3, 4]) == -2
    print("All tests passed!")`,
      },
      {
        slug: "stability-margin",
        title: "Stability Margin",
        shortDescription: "Estimate how far system poles are from instability.",
        difficulty: "medium",
        category: "Control",
        whyImplement:
          "Stability margins help engineers see whether a controller has enough room before oscillation or runaway behavior.",
        description: `# Stability Margin

## Task
Implement stability_margin(poles), returning the minimum distance from the imaginary axis for stable continuous-time poles.

For stable poles, use min(-real(pole)). If any pole has real part >= 0, return 0.

## Real-World Context
Control dashboards use margin-style metrics to warn engineers when systems are close to instability.`,
        skeleton: `def stability_margin(poles):
    """Return a simple continuous-time stability margin."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_stability_margin():
    assert stability_margin([-2 + 1j, -5 + 0j]) == 2
    assert stability_margin([-1 + 0j, 0.1 + 0j]) == 0
    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "signal-processing",
    subject: "electrical",
    title: "Signal Processing",
    year: 2026,
    authors: ["PaperCode Team"],
    category: "ELECTRICAL",
    description:
      "Implement filtering and convolution tools used to clean and transform sampled signals.",
    realWorldUse:
      "Signal-processing primitives power audio devices, vibration monitoring, medical sensors, radar, communication receivers, and IoT analytics pipelines.",
    systems: ["Audio processing", "Medical sensors", "IoT analytics"],
    tasks: [
      {
        slug: "discrete-convolution",
        title: "Discrete Convolution",
        shortDescription: "Combine a signal with a finite impulse response kernel.",
        difficulty: "medium",
        category: "DSP",
        whyImplement:
          "Convolution is the base operation behind filters, edge detection, audio effects, and many neural network layers.",
        description: `# Discrete Convolution

## Task
Implement discrete_convolution(x, h), returning the full 1D convolution.

## Real-World Context
DSP systems use convolution to filter signals, detect patterns, and model system responses.`,
        skeleton: `def discrete_convolution(x, h):
    """Return full 1D convolution of x and h."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_discrete_convolution():
    assert discrete_convolution([1, 2, 3], [1, 1]) == [1, 3, 5, 3]
    print("All tests passed!")`,
      },
      {
        slug: "moving-average",
        title: "Moving Average",
        shortDescription: "Smooth a signal using a sliding average window.",
        difficulty: "easy",
        category: "DSP",
        whyImplement:
          "Moving averages reduce noise in telemetry, finance, sensor, and manufacturing signals while staying explainable.",
        description: `# Moving Average

## Task
Implement moving_average(samples, window), returning valid-window averages.

For [1, 2, 3, 4] with window 2, return [1.5, 2.5, 3.5].

## Real-World Context
Dashboards often smooth sensor data to make trends visible without hiding the raw signal model.`,
        skeleton: `def moving_average(samples, window):
    """Return valid moving average values."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_moving_average():
    assert moving_average([1, 2, 3, 4], 2) == [1.5, 2.5, 3.5]
    print("All tests passed!")`,
      },
      {
        slug: "low-pass-iir",
        title: "Low-Pass IIR Filter",
        shortDescription: "Implement exponential smoothing as a simple low-pass filter.",
        difficulty: "easy",
        category: "DSP",
        whyImplement:
          "IIR smoothing is used in embedded sensors because it is cheap, stateful, and easy to run in real time.",
        description: `# Low-Pass IIR Filter

## Task
Implement low_pass_iir(samples, alpha).

Use y[0] = samples[0] and y[n] = alpha * samples[n] + (1 - alpha) * y[n - 1].

## Real-World Context
Wearables, controllers, and IoT sensors use low-pass filters to suppress fast noise before decisions are made.`,
        skeleton: `def low_pass_iir(samples, alpha):
    """Return exponentially smoothed samples."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_low_pass_iir():
    out = low_pass_iir([0, 10, 10], 0.5)
    assert out == [0, 5.0, 7.5]
    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "digital-logic",
    subject: "electronics",
    title: "Digital Logic",
    year: 2026,
    authors: ["PaperCode Team"],
    category: "ELECTRONICS",
    description:
      "Implement the Boolean primitives that become multiplexers, adders, truth tables, and hardware datapaths.",
    realWorldUse:
      "Digital logic is the foundation of CPUs, microcontrollers, FPGA designs, memory controllers, hardware accelerators, and verification tooling.",
    systems: ["CPUs", "FPGAs", "Hardware verification"],
    tasks: [
      {
        slug: "mux4",
        title: "4-to-1 Multiplexer",
        shortDescription: "Select one of four input values with a two-bit selector.",
        difficulty: "easy",
        category: "Logic",
        whyImplement:
          "Multiplexers are everywhere in datapaths, bus routing, ALUs, and configurable hardware blocks.",
        description: `# 4-to-1 Multiplexer

## Task
Implement mux4(inputs, select), returning inputs[select] for select values 0 through 3.

## Real-World Context
Processors and FPGAs use multiplexers to choose which signal moves through a datapath each clock cycle.`,
        skeleton: `def mux4(inputs, select):
    """Return selected input from a 4-item sequence."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_mux4():
    assert mux4([10, 20, 30, 40], 2) == 30
    assert mux4([False, True, False, True], 1) is True
    print("All tests passed!")`,
      },
      {
        slug: "half-adder",
        title: "Half Adder",
        shortDescription: "Compute sum and carry bits for one-bit addition.",
        difficulty: "easy",
        category: "Logic",
        whyImplement:
          "Adders are the basic arithmetic blocks used in ALUs, address generators, and DSP hardware.",
        description: `# Half Adder

## Task
Implement half_adder(a, b), returning (sum_bit, carry_bit).

## Real-World Context
Large adders in CPUs are composed from smaller Boolean building blocks like this.`,
        skeleton: `def half_adder(a, b):
    """Return (sum_bit, carry_bit) for two input bits."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_half_adder():
    assert half_adder(0, 0) == (0, 0)
    assert half_adder(1, 0) == (1, 0)
    assert half_adder(1, 1) == (0, 1)
    print("All tests passed!")`,
      },
      {
        slug: "truth-table-from-lut",
        title: "Truth Table from LUT",
        shortDescription: "Expand a lookup table into input-output truth rows.",
        difficulty: "medium",
        category: "Verification",
        whyImplement:
          "Truth tables help engineers verify logic blocks and explain what a LUT or gate network actually implements.",
        description: `# Truth Table from LUT

## Task
Implement truth_table_from_lut(lut, bits).

Return rows as tuples (inputs, output), where inputs is a tuple of bits for each integer index.

## Real-World Context
FPGA tools and hardware tests expand LUT behavior to verify combinational logic.`,
        skeleton: `def truth_table_from_lut(lut, bits):
    """Return truth table rows for a lookup table."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_truth_table_from_lut():
    table = truth_table_from_lut([0, 1, 1, 0], 2)
    assert table[0] == ((0, 0), 0)
    assert table[3] == ((1, 1), 0)
    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "sequential-logic",
    subject: "electronics",
    title: "Sequential Logic",
    year: 2026,
    authors: ["PaperCode Team"],
    category: "ELECTRONICS",
    description:
      "Implement next-state logic for flip-flops, counters, and tiny finite-state machines.",
    realWorldUse:
      "Sequential logic powers counters, protocols, instruction pipelines, debouncers, timers, controllers, and state machines in almost every digital device.",
    systems: ["Protocol controllers", "Timers", "Instruction pipelines"],
    tasks: [
      {
        slug: "dff-next",
        title: "D Flip-Flop Next State",
        shortDescription: "Update stored state when enable is active.",
        difficulty: "easy",
        category: "State",
        whyImplement:
          "Flip-flops are the storage cells that let digital systems remember state across clock cycles.",
        description: `# D Flip-Flop Next State

## Task
Implement dff_next(d, enable, q), returning d when enable is True and q otherwise.

## Real-World Context
Registers, counters, and pipelines are built from flip-flops controlled by enable signals.`,
        skeleton: `def dff_next(d, enable, q):
    """Return next stored bit."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_dff_next():
    assert dff_next(1, True, 0) == 1
    assert dff_next(1, False, 0) == 0
    print("All tests passed!")`,
      },
      {
        slug: "counter-next",
        title: "Wrapping Counter",
        shortDescription: "Advance an unsigned counter with fixed bit width.",
        difficulty: "easy",
        category: "State",
        whyImplement:
          "Counters drive timers, addresses, PWM generators, and communication protocol sequencing.",
        description: `# Wrapping Counter

## Task
Implement counter_next(value, width), returning (value + 1) modulo 2 ** width.

## Real-World Context
Embedded timers and hardware controllers use wrapping counters to track cycles and events.`,
        skeleton: `def counter_next(value, width):
    """Return next counter value for a fixed bit width."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_counter_next():
    assert counter_next(2, 2) == 3
    assert counter_next(3, 2) == 0
    print("All tests passed!")`,
      },
      {
        slug: "fsm-transition",
        title: "Pattern Detector FSM",
        shortDescription: "Implement transitions for a finite-state machine that detects 101.",
        difficulty: "medium",
        category: "State Machines",
        whyImplement:
          "FSMs are used for serial protocols, packet parsing, instruction control, and user-input recognition.",
        description: `# Pattern Detector FSM

## Task
Implement fsm_transition(state, bit) for states S0, S1, and S10.

The machine tracks whether the recent input could become pattern 101. Return (next_state, detected), where detected is True only when the new bit completes 101.

## Real-World Context
Hardware controllers use FSMs to detect patterns in serial streams and coordinate multi-step behavior.`,
        skeleton: `def fsm_transition(state, bit):
    """Return (next_state, detected) for a 101 detector."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_fsm_transition():
    state, hit = fsm_transition("S0", 1)
    assert (state, hit) == ("S1", False)
    state, hit = fsm_transition(state, 0)
    assert (state, hit) == ("S10", False)
    state, hit = fsm_transition(state, 1)
    assert (state, hit) == ("S1", True)
    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "cmos-analog",
    subject: "electronics",
    title: "CMOS and Analog Basics",
    year: 2026,
    authors: ["PaperCode Team"],
    category: "ELECTRONICS",
    description:
      "Implement first-order estimates for switching power, inverter behavior, and RC delay.",
    realWorldUse:
      "CMOS and analog estimates help engineers budget power, timing, and voltage behavior before layout and detailed simulation.",
    systems: ["Chip design", "Timing analysis", "Low-power devices"],
    tasks: [
      {
        slug: "dynamic-power",
        title: "CMOS Dynamic Power",
        shortDescription: "Estimate switching power from capacitance, voltage, and frequency.",
        difficulty: "easy",
        category: "Power",
        whyImplement:
          "Dynamic power estimates guide battery-life, thermal, and clock-frequency decisions in chip design.",
        description: `# CMOS Dynamic Power

## Task
Implement cmos_dynamic_power(capacitance, voltage, frequency, activity=1.0), returning activity * capacitance * voltage^2 * frequency.

## Real-World Context
Digital chips spend much of their energy charging and discharging capacitances when gates switch.`,
        skeleton: `def cmos_dynamic_power(capacitance, voltage, frequency, activity=1.0):
    """Return estimated dynamic switching power."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_cmos_dynamic_power():
    assert abs(cmos_dynamic_power(1e-12, 1.0, 1e9) - 1e-3) < 1e-12
    print("All tests passed!")`,
      },
      {
        slug: "inverter-trip-point",
        title: "Inverter Trip Point",
        shortDescription: "Estimate switching threshold from pull-up and pull-down strengths.",
        difficulty: "medium",
        category: "Analog",
        whyImplement:
          "Trip-point estimates help designers reason about noise margin and transistor sizing before simulation.",
        description: `# Inverter Trip Point

## Task
Implement inverter_trip_point(vdd, beta_n, beta_p).

Use vdd / (1 + sqrt(beta_n / beta_p)).

## Real-World Context
CMOS inverter behavior is the starting point for understanding digital gate thresholds and noise margins.`,
        skeleton: `import math

def inverter_trip_point(vdd, beta_n, beta_p):
    """Return approximate inverter switching point."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_inverter_trip_point():
    assert abs(inverter_trip_point(1.2, 1.0, 1.0) - 0.6) < 1e-9
    print("All tests passed!")`,
      },
      {
        slug: "rc-delay",
        title: "RC Delay",
        shortDescription: "Estimate digital transition delay with a first-order RC model.",
        difficulty: "easy",
        category: "Timing",
        whyImplement:
          "RC delay is the quick timing estimate behind interconnect analysis, gate sizing, and setup timing intuition.",
        description: `# RC Delay

## Task
Implement rc_delay(resistance, capacitance), returning 0.69 * resistance * capacitance.

## Real-World Context
Timing tools use more detailed models, but RC delay gives engineers a clear first-order view of signal settling.`,
        skeleton: `def rc_delay(resistance, capacitance):
    """Return first-order RC delay."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_rc_delay():
    assert abs(rc_delay(1000, 1e-12) - 0.69e-9) < 1e-18
    print("All tests passed!")`,
      },
    ],
  },
  {
    slug: "embedded-systems",
    subject: "electronics",
    title: "Embedded Systems",
    year: 2026,
    authors: ["PaperCode Team"],
    category: "ELECTRONICS",
    description:
      "Implement tiny datapath and firmware primitives used in microcontrollers and low-level devices.",
    realWorldUse:
      "Embedded software and hardware meet in register decoding, ALU operations, debounce logic, and real-time state updates for sensors, robots, appliances, and control boards.",
    systems: ["Microcontrollers", "Firmware tools", "Sensor devices"],
    tasks: [
      {
        slug: "tiny-alu",
        title: "Tiny ALU",
        shortDescription: "Implement a small arithmetic logic unit with common operations.",
        difficulty: "easy",
        category: "Datapath",
        whyImplement:
          "ALUs execute the arithmetic and bitwise operations at the heart of CPUs, MCUs, and accelerators.",
        description: `# Tiny ALU

## Task
Implement tiny_alu(op, a, b), supporting add, and, or, and xor.

## Real-World Context
Even complex processors are built from simple datapath operations like these.`,
        skeleton: `def tiny_alu(op, a, b):
    """Return result for add, and, or, or xor."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_tiny_alu():
    assert tiny_alu("add", 2, 3) == 5
    assert tiny_alu("and", 6, 3) == 2
    assert tiny_alu("xor", 6, 3) == 5
    print("All tests passed!")`,
      },
      {
        slug: "decode-rv32i-fields",
        title: "Decode RV32I Register Fields",
        shortDescription: "Extract rd, rs1, and rs2 fields from a 32-bit instruction.",
        difficulty: "medium",
        category: "Instruction Decode",
        whyImplement:
          "Instruction decoders turn raw machine words into the register addresses and control signals a processor needs.",
        description: `# Decode RV32I Register Fields

## Task
Implement decode_rv32i_fields(instr), returning a dictionary with rd, rs1, and rs2.

Use rd bits 7..11, rs1 bits 15..19, and rs2 bits 20..24.

## Real-World Context
Disassemblers, simulators, and CPU decode stages extract these fields from binary instructions.`,
        skeleton: `def decode_rv32i_fields(instr):
    """Return rd, rs1, and rs2 fields from a 32-bit instruction."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_decode_rv32i_fields():
    instr = (5 << 7) | (2 << 15) | (3 << 20)
    assert decode_rv32i_fields(instr) == {"rd": 5, "rs1": 2, "rs2": 3}
    print("All tests passed!")`,
      },
      {
        slug: "debounce-samples",
        title: "Debounce Samples",
        shortDescription: "Accept a button state only after enough consecutive samples agree.",
        difficulty: "easy",
        category: "Firmware",
        whyImplement:
          "Debouncing prevents noisy mechanical buttons from creating false clicks in embedded products.",
        description: `# Debounce Samples

## Task
Implement debounce_samples(samples, threshold), returning the first value that appears threshold times consecutively.

Return None if no stable value is found.

## Real-World Context
Firmware filters switch bounce so UI buttons, knobs, and sensors behave predictably.`,
        skeleton: `def debounce_samples(samples, threshold):
    """Return stable value after threshold consecutive equal samples."""
    # YOUR CODE HERE
    raise NotImplementedError`,
        tests: `def test_debounce_samples():
    assert debounce_samples([0, 1, 0, 1, 1, 1], 3) == 1
    assert debounce_samples([0, 1, 0, 1], 2) is None
    print("All tests passed!")`,
      },
    ],
  },
];
