# Project Setup

This document provides instructions for setting up and running the application.

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Rust](https://www.rust-lang.org/) (for building the Wasm binary)

## Installation

1. **Install Frontend Dependencies**  
   To install the necessary frontend dependencies, run the following command:

   ```bash
   npm install

2. **Generate the Wasm Binary**
   If making changes to the Rust backend (AGC logic), you need to generate the WebAssembly (Wasm) binary to allow React to communicate with the backend efficienity:

   ```bash
   npm run build wasm

3. **Running the Project**
   Start development server with:

   ```bash
   npm run dev
