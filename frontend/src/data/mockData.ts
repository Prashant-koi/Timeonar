import { TimelineData } from '../types/timeline';

export const mockMachineLearningData: TimelineData = {
  topic: "Machine Learning",
  timeline: [
    {
      id: "ml-1956",
      year: 1956,
      title: "The Dartmouth Summer Research Project on Artificial Intelligence",
      discovery: "First formal workshop on artificial intelligence",
      summary: "John McCarthy, Marvin Minsky, Claude Shannon, and Nathaniel Rochester organized this workshop which coined the term 'artificial intelligence'.",
      source: "Dartmouth College Conference Proposal",
      url: "https://www-formal.stanford.edu/jmc/history/dartmouth/dartmouth.html",
      authors: ["John McCarthy", "Marvin Minsky", "Claude Shannon", "Nathaniel Rochester"],
      citationCount: 5200,
      keyInsight: "This event is widely considered the founding event of artificial intelligence as a field."
    },
    {
      id: "ml-1986",
      year: 1986,
      title: "Learning representations by back-propagating errors",
      discovery: "Backpropagation algorithm for neural networks",
      summary: "Rumelhart, Hinton, and Williams formalized the backpropagation algorithm for training multi-layer neural networks.",
      source: "Nature",
      url: "https://www.nature.com/articles/323533a0",
      authors: ["David E. Rumelhart", "Geoffrey E. Hinton", "Ronald J. Williams"],
      citationCount: 24000,
      keyInsight: "This algorithm enabled effective training of deep neural networks, overcoming previous limitations."
    },
    {
      id: "ml-2012",
      year: 2012,
      title: "ImageNet Classification with Deep Convolutional Neural Networks",
      discovery: "AlexNet - breakthrough in deep learning",
      summary: "Krizhevsky, Sutskever, and Hinton created a deep convolutional neural network that significantly outperformed previous methods in image classification.",
      source: "Advances in Neural Information Processing Systems",
      url: "https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html",
      authors: ["Alex Krizhevsky", "Ilya Sutskever", "Geoffrey E. Hinton"],
      citationCount: 73000,
      keyInsight: "This paper demonstrated the effectiveness of deep learning in computer vision and sparked renewed interest in neural networks."
    }
  ]
};