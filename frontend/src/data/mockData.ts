import { TimelineData } from '../types/timeline';

export const mockMachineLearningData: TimelineData = {
  topic: "Machine Learning",
  timeline: [
    {
      id: "ml-1",
      year: 1943,
      title: "First Artificial Neural Network Model",
      discovery: "Development of a mathematical model for neural networks using electrical circuits.",
      summary: "Walter Pitts and Warren McCulloch introduced the first computational model of a neural network, demonstrating how simple logical functions could be represented by networks of artificial neurons.",
      source: "Bulletin of Mathematical Biophysics",
      url: "https://doi.org/10.1007/BF02478259",
      authors: [
        "Warren S. McCulloch",
        "Walter Pitts"
      ],
      citationCount: "20000",
      keyInsight: "Showed that neural networks could, in principle, compute any function, laying the groundwork for later neural network research.",
      methodology: "McCulloch and Pitts developed a formal mathematical model of neural activity by abstracting biological neurons into simple logical elements. They used symbolic logic, specifically a time-extended variant of the notation from Russell and Whitehead's Principia Mathematica, to represent the function of each neuron and the network as a whole. Their model treated each neuron as an 'all-or-none' unit that fires if a certain threshold of input is met, and they described the propagation of logical states through the network over discrete time steps. The approach was entirely theoretical and analytical, relying on mathematical proofs and logical calculus rather than empirical experimentation or physical circuits.",
      theoreticalParadigm: "The research operated within the paradigm of computationalism and early cybernetics, conceptualizing the brain as a computational device capable of logical reasoning. It challenged the prevailing view of the nervous system as merely a biological network by demonstrating that networks of simple, abstracted units could compute any logical function. This work laid the foundation for automata theory and the broader field of artificial intelligence by framing cognition and neural activity in terms of symbolic logic and computation.",
      fieldEvolution: "This foundational work led to the development of computational neuroscience and inspired generations of neural network research. It provided the theoretical basis for later models including perceptrons in the 1950s and more complex artificial neural networks. By establishing that neural networks could compute logical functions, it expanded the understanding of both biological and artificial intelligence systems."
    },
    {
      id: "ml-2",
      year: 1949,
      title: "Hebbian Learning Rule",
      discovery: "Formulation of a learning rule for synaptic plasticity based on neuron activity.",
      summary: "Donald Hebb proposed that connections between neurons are strengthened when they are activated together, providing a biological basis for learning in neural networks.",
      source: "Book published by John Wiley & Sons",
      url: "https://doi.org/10.1037/h0055347",
      authors: [
        "Donald O. Hebb"
      ],
      citationCount: "Over 30,000",
      keyInsight: "Established a foundational principle for learning algorithms in artificial neural networks.",
      methodology: "Donald Hebb employed a theoretical and conceptual approach grounded in neuropsychology and neuroscience. He synthesized existing empirical findings from neurophysiology, psychology, and behavioral studies to propose a general principle of synaptic plasticity. Hebb did not conduct new laboratory experiments for this rule; instead, he developed a formal hypothesis based on the observation that repeated and persistent activation of one neuron by another leads to lasting changes in synaptic strength. His methodology involved logical reasoning, integration of case studies, and translation of behavioral learning concepts (such as Pavlovian conditioning) into neural terms, culminating in the formulation of the Hebbian learning rule in his 1949 book 'The Organization of Behavior.'[1][2][3]",
      theoreticalParadigm: "The research operated within the neuropsychological and associative learning paradigm, bridging psychological theories of learning with biological mechanisms in the brain. Hebb's framework challenged the prevailing behaviorist view by proposing that learning and memory are rooted in physical changes at the synaptic level, specifically through the strengthening of connections between co-activated neurons. This paradigm established a biological basis for associative learning and provided the conceptual foundation for later developments in neural network theory and unsupervised learning in artificial intelligence.[1][2]",
      fieldEvolution: "Hebbian learning evolved from a biological theory into a fundamental principle in artificial neural networks, influencing the development of unsupervised learning algorithms, associative memory models, and self-organizing maps. This principle became central to competitive learning networks and was later formalized mathematically in various models including Hopfield networks and Boltzmann machines. The concept continues to influence modern deep learning architectures by informing weight initialization and update strategies."
    },
    {
      id: "ml-3",
      year: 1950,
      title: "Turing Test",
      discovery: "Introduction of a test to determine if a machine can exhibit intelligent behavior indistinguishable from a human.",
      summary: "Alan Turing proposed the Turing Test, which became a benchmark for evaluating machine intelligence and inspired research into machine learning and artificial intelligence.",
      source: "Mind",
      url: "https://doi.org/10.1093/mind/LIX.236.433",
      authors: [
        "A. M. Turing"
      ],
      citationCount: "40000",
      keyInsight: "Framed the challenge of machine intelligence and motivated the development of learning algorithms.",
      methodology: "The Turing Test methodology involves a controlled experimental setup where three separate rooms are connected via screens and keyboards. In the original design, a human evaluator (judge) engages in natural language conversations with two participants they cannot see: one human and one machine. The evaluator asks questions to both participants and receives text-only responses. If the evaluator cannot reliably distinguish the machine from the human based on their responses, the machine is said to pass the test. This methodology evolved from a game called 'The Imitation Game' which originally involved a male, female, and judge, where the female tried to convince the judge she was male. Turing adapted this by replacing one participant with a computer program. The methodology deliberately restricts interaction to text-only communication to eliminate physical appearance as a factor and focuses purely on cognitive and linguistic capabilities.",
      theoreticalParadigm: "The Turing Test operates within a behaviorist theoretical paradigm that defines intelligence operationally rather than essentially. Turing explicitly rejected the question 'Can machines think?' as 'too meaningless' to deserve discussion, shifting the paradigm from introspective definitions of intelligence to observable behavior. This paradigm challenges Cartesian dualism by suggesting that if a machine's responses are indistinguishable from a human's, there is no operational basis to deny it possesses 'intelligence.' The theoretical framework deliberately avoids defining consciousness or understanding, focusing instead on the functional equivalence of outputs. This behaviorist approach represented a significant departure from prevailing philosophical traditions about mind and intelligence, establishing an empirical rather than metaphysical foundation for artificial intelligence research. The paradigm also implicitly suggests that intelligence exists on a spectrum rather than as a binary human/non-human quality.",
      fieldEvolution: "The Turing Test has evolved from a theoretical thought experiment to a practical benchmark in AI development. It has inspired numerous competitions like the Loebner Prize and driven research in natural language processing, knowledge representation, and reasoning. Recent large language models like GPT-4 approach passing restricted versions of the test in some domains, though debate continues about whether passing the test truly indicates machine intelligence or simply sophisticated pattern matching. The test has also evolved conceptually, with variants like the Total Turing Test (including physical capabilities) and the Reverse Turing Test (used in CAPTCHA systems)."
    },
    {
      id: "ml-4",
      year: 1957,
      title: "Perceptron Algorithm",
      discovery: "Creation of the perceptron, the first algorithm for supervised learning of binary classifiers.",
      summary: "Frank Rosenblatt developed the perceptron, an early neural network model capable of learning to classify input data into two categories.",
      source: "Psychological Review",
      url: "https://doi.org/10.1037/h0042519",
      authors: [
        "Frank Rosenblatt"
      ],
      citationCount: "15000",
      keyInsight: "Demonstrated that machines could learn from data, sparking interest in neural network research.",
      methodology: "Rosenblatt's research involved constructing both mathematical models and physical hardware implementations of the perceptron. The perceptron was designed as a single-layer neural network with adjustable weights connecting input units to an output unit. The methodology centered on supervised learning: the perceptron was trained on labeled input-output pairs, and its weights were updated using the perceptron learning rule, which adjusted weights in proportion to the product of the input and the error between the predicted and actual output. Experiments included using devices such as a 'TV camera' for input and signal lights or printers for output, and the learning process was automated in hardware using electric motors to adjust potentiometers representing weights. Rosenblatt also explored various architectural variants, including multi-layer and recurrent connections, and tested the perceptron on tasks such as image and audio recognition.",
      theoreticalParadigm: "The perceptron operated within the connectionist paradigm, inspired by biological neural networks. It challenged the prevailing symbolic AI approaches of the time by proposing that learning and pattern recognition could emerge from simple, distributed processing units with adaptive connections. The perceptron model was grounded in the idea that intelligence could be achieved through learning from data, rather than explicit rule-based programming, marking a foundational shift toward data-driven, statistical learning in artificial intelligence.",
      fieldEvolution: "After initial enthusiasm, perceptron research faced a significant setback with the publication of 'Perceptrons' by Minsky and Papert in 1969, which highlighted the algorithm's inability to learn non-linearly separable functions like XOR. This led to the first 'AI winter' in neural network research. However, the perceptron's legacy continued through developments in multi-layer networks and eventually contributed to the resurgence of neural networks in the 1980s with backpropagation. Today's deep learning systems still incorporate the fundamental principles of the perceptron in their neurons and weight update mechanisms."
    },
    {
      id: "ml-5",
      year: 1967,
      title: "Nearest Neighbor Algorithm",
      discovery: "Introduction of the nearest neighbor algorithm for pattern recognition.",
      summary: "The nearest neighbor method enabled machines to classify objects based on the closest training examples in the feature space.",
      source: "IEEE Transactions on Information Theory",
      url: "https://isl.stanford.edu/~cover/papers/transIT/0021cove.pdf",
      authors: [
        "T.M. Cover",
        "P.E. Hart"
      ],
      citationCount: "Over 20,000",
      keyInsight: "Provided a simple yet powerful approach to pattern recognition and classification.",
      methodology: "The research introduced a non-parametric, instance-based approach to pattern classification. The methodology involved assigning an unclassified sample to the class of its nearest neighbor in the feature space, based on a defined distance metric (typically Euclidean distance). The experimental design focused on analyzing the theoretical properties of this rule, such as its error rate compared to the optimal Bayes classifier, and provided mathematical proofs showing that as the number of samples increases, the error rate of the nearest neighbor rule approaches at most twice the Bayes error rate. No explicit model training was required; instead, the algorithm relied on the entire set of labeled training data for classification decisions.",
      theoreticalParadigm: "The research operated within the statistical pattern recognition and decision theory paradigm, specifically challenging the necessity of parametric assumptions about data distributions. By adopting a non-parametric framework, the nearest neighbor algorithm demonstrated that effective classification could be achieved without estimating underlying probability densities, thus broadening the conceptual foundation of machine learning beyond traditional parametric models.",
      fieldEvolution: "The k-nearest neighbors algorithm evolved from its simple 1-NN origins to include weighted variants, kernel-based approaches, and adaptive neighborhood sizing. It became a cornerstone of non-parametric methods in machine learning, influencing the development of case-based reasoning, locally weighted regression, and similarity-based learning. In modern applications, k-NN underpins recommendation systems, anomaly detection algorithms, and serves as a foundation for more complex methods like manifold learning and spectral clustering. Its continued relevance demonstrates the enduring power of simple, interpretable algorithms in the era of complex deep learning models."
    },
    {
      id: "ml-6",
      year: 1986,
      title: "Backpropagation for Neural Networks",
      discovery: "Popularization of the backpropagation algorithm for training multi-layer neural networks.",
      summary: "Backpropagation enabled efficient training of deep neural networks by propagating errors backward through the network.",
      source: "Nature",
      url: "https://doi.org/10.1038/323533a0",
      authors: [
        "David E. Rumelhart",
        "Geoffrey E. Hinton",
        "Ronald J. Williams"
      ],
      citationCount: "35000",
      keyInsight: "Made it feasible to train complex neural networks, leading to advances in deep learning.",
      methodology: "Backpropagation employs gradient descent optimization to minimize a loss function that measures the difference between desired and actual outputs of a neural network. The algorithm works by first performing a forward pass through the network to compute outputs, then calculating error at the output layer, and finally propagating this error backward through the network layers using the chain rule of calculus to compute partial derivatives. These derivatives indicate how each weight contributes to the overall error, allowing for systematic weight updates. The method enables training of multi-layer neural networks with non-linear activation functions, overcoming limitations of earlier approaches like the perceptron learning rule and Widrow-Hoff learning rule.",
      theoreticalParadigm: "Backpropagation operates within the supervised learning paradigm of machine learning, where models learn from labeled training examples. It represents a significant advancement in connectionist approaches to artificial intelligence, challenging symbolic AI paradigms that dominated earlier research. The theoretical foundation rests on viewing neural networks as compositions of differentiable functions, allowing the application of calculus to optimize network parameters. This paradigm shift enabled learning representations directly from data rather than through hand-engineered features, establishing the groundwork for deep learning. While the mathematical principles existed earlier (dating back to Linnainmaa's work in 1970), the 1986 paper by Rumelhart, Hinton, and Williams demonstrated its practical effectiveness for training complex neural networks, fundamentally changing how researchers approached machine learning problems.",
      fieldEvolution: "Backpropagation transformed neural networks from theoretical curiosities into practical tools, leading to a renaissance in connectionist AI during the late 1980s and early 1990s. The algorithm has since been refined with techniques like momentum, adaptive learning rates, regularization, and batch normalization to improve convergence and generalization. It remains the core training algorithm for deep learning despite challenges with vanishing/exploding gradients in very deep networks. Modern variations include stochastic gradient descent with mini-batches, Adam optimization, and architectural innovations like residual connections that facilitate gradient flow in extremely deep networks. The success of backpropagation established gradient-based optimization as the dominant paradigm in neural network training."
    },
    {
      id: "ml-7",
      year: 2014,
      title: "DeepFace: Human-Level Face Recognition",
      discovery: "Development of a deep learning system that achieved near-human accuracy in face recognition.",
      summary: "Facebook's DeepFace system used deep neural networks to identify faces with 97.35% accuracy, surpassing previous methods by a significant margin.",
      source: "Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR) 2014",
      url: "https://doi.org/10.1109/CVPR.2014.220",
      authors: [
        "Yaniv Taigman",
        "Ming Yang",
        "Marc'Aurelio Ranzato",
        "Lior Wolf"
      ],
      citationCount: "8000",
      keyInsight: "Showed the practical power of deep learning for complex real-world tasks.",
      methodology: "DeepFace employed a four-stage pipeline: detect → align → represent → classify. The methodology involved explicit 3D face modeling to apply piecewise affine transformation for accurate alignment, followed by a nine-layer deep neural network for face representation. This deep network contained over 120 million parameters using locally connected layers without weight sharing, rather than standard convolutional layers. The system was trained on an identity-labeled dataset of four million facial images belonging to more than 4,000 identities. DeepFace created 3D models of faces from photos, which could be rotated to provide matching of the same face captured at different angles, overcoming limitations of previous facial recognition systems that struggled with different head orientations.",
      theoreticalParadigm: "DeepFace operated within the deep learning paradigm, specifically applying neural networks to computer vision problems. It represented a shift from traditional pattern recognition approaches to data-driven representation learning. The research challenged existing theoretical limitations in facial recognition by demonstrating that with sufficient training data and appropriate neural network architecture, machines could approach human-level performance in complex perceptual tasks. The paradigm emphasized that deep architectures with millions of parameters, when trained on large-scale datasets, could learn hierarchical representations powerful enough to capture the subtle variations in human faces across different poses and conditions, fundamentally changing the theoretical understanding of what was possible in automated facial recognition.",
      fieldEvolution: "DeepFace marked a turning point in facial recognition, triggering rapid advances in the field and widespread adoption across commercial and government applications. Subsequent systems improved both accuracy and efficiency, leading to the integration of facial recognition into smartphones, security systems, and social media platforms. The technology has evolved to handle increasingly challenging conditions including extreme poses, occlusions, and aging, while also addressing ethical concerns through fairness and bias reduction techniques. Modern systems have moved beyond simple recognition to emotion detection, age estimation, and 3D face reconstruction, with accuracy rates now exceeding 99% on standard benchmarks."
    },
    {
      id: "ml-8",
      year: 2017,
      title: "Transformer Architecture",
      discovery: "Invention of the transformer model for sequence processing.",
      summary: "The transformer architecture enabled faster and more effective training of neural networks on sequential data, revolutionizing natural language processing.",
      source: "Advances in Neural Information Processing Systems",
      url: "https://papers.neurips.cc/paper/7181-attention-is-all-you-need.pdf",
      authors: [
        "Ashish Vaswani",
        "Noam Shazeer",
        "Niki Parmar",
        "Jakob Uszkoreit",
        "Llion Jones",
        "Aidan N. Gomez",
        "Łukasz Kaiser",
        "Illia Polosukhin"
      ],
      citationCount: "Over 100,000",
      keyInsight: "Introduced attention mechanisms, leading to breakthroughs in language models and generative AI.",
      methodology: "The Transformer architecture was developed using a neural network approach that completely dispensed with recurrence and convolutions, relying solely on attention mechanisms. The experimental design involved creating a model with an encoder-decoder structure, each composed of stacks of N=6 identical layers. The encoder layers contained two sublayers: multi-head self-attention and position-wise fully connected feed-forward networks. The decoder layers contained three sublayers: causally masked self-attention, cross-attention, and feed-forward networks. Residual connections were employed around each sublayer, followed by layer normalization to facilitate numerical stability and convergence. The model used an output dimension of dmodel=512 for all sublayers and embedding layers. Two normalization conventions were explored: post-LN (original implementation) and pre-LN (later found to improve training stability). The methodology included careful hyperparameter tuning and a 'warm-up' learning rate schedule for the post-LN variant.",
      theoreticalParadigm: "The Transformer architecture operated within the deep learning paradigm but challenged the prevailing sequential processing frameworks of RNNs and CNNs for sequence transduction tasks. It introduced a revolutionary theoretical approach based on the premise that 'attention is all you need' - proposing that self-attention mechanisms alone could effectively capture dependencies between input and output sequences without sequential computation. This paradigm shift moved away from the recurrent processing of data in favor of parallel computation through attention, allowing the model to consider all positions in a sequence simultaneously rather than sequentially. The theoretical framework incorporated concepts of residual connections to address vanishing gradient issues, layer normalization for training stability, and multi-head attention to jointly attend to information from different representation subspaces. This paradigm fundamentally changed how sequential data is processed in neural networks, establishing a new foundation for language models and eventually extending to other domains like computer vision and time series forecasting.",
      fieldEvolution: "The Transformer architecture catalyzed unprecedented progress in NLP, leading to breakthrough models like BERT, GPT, and T5 that achieved state-of-the-art performance across nearly all language tasks. Its impact rapidly extended beyond language to computer vision (Vision Transformers), multimodal learning, biological sequence analysis, and even music generation. The architecture has scaled from the original 100M parameters to models exceeding 1 trillion parameters, enabling increasingly sophisticated capabilities. Efficiency innovations like sparse attention, linear attention, and structured state space models have addressed the quadratic complexity limitations, while architectural refinements like pre-normalization, flash attention, and parameter-efficient fine-tuning have improved training stability and deployment flexibility. The Transformer has become the dominant architecture in modern AI, powering generative models that have transformed both research and practical applications."
    },
    {
      id: "ml-9",
      year: 2018,
      title: "AlphaFold: Protein Structure Prediction",
      discovery: "Application of deep learning to accurately predict protein structures.",
      summary: "AlphaFold demonstrated that machine learning could solve the long-standing problem of protein folding, achieving unprecedented accuracy in structure prediction.",
      source: "Nature",
      url: "https://discovery.ucl.ac.uk/10089234/1/343019_3_art_0_py4t4l_convrt.pdf",
      authors: [
        "Andrew Senior",
        "John Jumper",
        "Demis Hassabis",
        "DeepMind Team"
      ],
      citationCount: "15000",
      keyInsight: "Proved that machine learning could make significant contributions to fundamental scientific problems.",
      methodology: "AlphaFold uses deep learning to predict protein structures from amino acid sequences. The methodology involves an ensemble-based prediction approach that analyzes families of related proteins rather than individual sequences. The system employs attention mechanisms and Transformers to capture long-range dependencies between amino acids, incorporates symmetry principles to reason over protein structures in three dimensions, and utilizes end-to-end differentiability as a unifying framework for learning from protein data. In CASP13 (2018), AlphaFold demonstrated superior performance by creating high-accuracy structures (TM-scores of 0.7 or higher) for 24 out of 43 free modeling domains, significantly outperforming other methods. The approach was particularly effective for proteins with relatively few homologous sequences, showing its ability to generalize across diverse protein families.",
      theoreticalParadigm: "AlphaFold operates within a paradigm that challenges traditional physics-based approaches to protein structure prediction. Rather than explicitly relying on physical principles that underpin protein folding, AlphaFold demonstrates that machine learning can extract folding patterns directly from evolutionary data. This represents a shift from physics-first to data-driven approaches in structural biology. The theoretical framework leverages the evolutionary information contained in multiple sequence alignments to infer structural constraints, suggesting that the history of protein evolution contains sufficient information to determine three-dimensional structure. This paradigm shift suggests that complex biological problems can be solved through computational learning from data rather than through explicit modeling of underlying physical laws, bridging artificial intelligence and fundamental scientific discovery.",
      fieldEvolution: "AlphaFold has revolutionized structural biology by making accurate protein structure prediction widely accessible. Since its breakthrough performance at CASP13, the improved AlphaFold2 (2020) achieved near-experimental accuracy for many proteins, leading to the public release of predicted structures for over 200 million proteins covering virtually all cataloged proteins. This democratization has accelerated drug discovery, enzyme design, and our understanding of disease mechanisms. The technology has evolved to predict protein complexes, model protein-ligand interactions, and inspire similar AI approaches in other scientific domains including RNA structure prediction, materials science, and chemical synthesis planning. AlphaFold exemplifies AI's potential to advance fundamental scientific research and demonstrates how machine learning can complement traditional scientific methods to solve previously intractable problems."
    }
  ]
};