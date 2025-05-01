# OrganInsight: AI-Powered 3D Medical Image Analysis

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

OrganInsight is a web-based application designed to make 3D medical image analysis more accessible and understandable through the use of artificial intelligence. It utilizes a pre-trained PyTorch model (trained on the OrganMNIST3D dataset) in its backend to classify 3D organ images. The frontend, built with HTML, CSS, and JavaScript, provides an intuitive and visually appealing platform for users to upload and view these medical scans.

By combining advanced AI techniques with an easy-to-use interface, OrganInsight aims to bridge the gap between complex medical imaging and clear interpretation, benefiting patients, healthcare professionals, and educators alike. The application also integrates the ChatGPT API to generate plain-language descriptions of the classified images, further enhancing accessibility for non-experts.

## Key Features

* **AI-Powered Classification:** Leverages a pre-trained PyTorch model for accurate identification of organs in 3D medical images.
* **Interactive 3D Image Visualization (Frontend Simulation):** Offers a platform to view uploaded 3D medical images (note: actual 3D rendering from user uploads is beyond basic HTML/CSS/JS and would require additional libraries or backend processing).
* **Plain Language Explanations:** Integrates with the ChatGPT API (backend) to provide easy-to-understand descriptions of the analysis results.
* **User-Friendly Interface:** Designed with simplicity and intuitiveness in mind, making it accessible to users with varying levels of technical expertise.
* **Clear Results Display:** Presents the classification results alongside the 3D image (simulated in this frontend) and the plain language description.

## Technologies Used (Frontend)

* HTML5
* CSS3
* JavaScript


## Future Enhancements (Frontend Perspective)

* More sophisticated (simulated) 3D image display techniques.
* Improved user interface elements and interactions.
* More detailed educational content on the "Learn More" page.
* Enhanced responsiveness and accessibility features.

## Contributing

Contributions to the frontend development of OrganInsight are welcome! Please feel free to submit pull requests with bug fixes, improvements, or new features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

* This project is inspired by the OrganMNIST3D dataset and the potential of AI in medical image analysis.
* The concept incorporates the use of PyTorch for AI modeling and the ChatGPT API for natural language processing (backend implementation).
* The visual design aims for a clean and modern aesthetic.
