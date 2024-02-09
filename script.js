function getChatGPTResponse(text) {
    // API endpoint URL
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    // Define the request data
    const requestData = {
    model: 'gpt-3.5-turbo',
    messages: [
    {
        role: 'system',
        content: text
    }
        ]
    };

    // Fetch API request
    return fetch(apiUrl, {
        method: 'POST', 
        headers: {
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer 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'
        },
        body: JSON.stringify(requestData), // Convert parameters to JSON string if required
    })
    .then(response => response.json()) // Parse response as JSON
    .catch(error => {
        console.error('Error:', error); // Log any errors to the console
        alert('An error occurred. Please try again later.'); // Display error message (replace with your preferred error handling)
        throw error;
    });
}

function explainCode() {
    // Extract code from the <code> element
    const codeElement = document.querySelector('pre.code-snippet code.language-python');
    const code = 'Explain the following code\n' + codeElement.textContent.trim(); // Trim whitespace
    // Call getChatGPTResponse() with the extracted code
    getChatGPTResponse(code).then(data => {
        // Handle API response data
        console.log(data);
        const contentArray = data.choices[0].message.content.split('\n');
        const contentHTML = contentArray.map(sentence => `<p>${sentence}</p>`).join('');
        document.getElementById('contentDisplay').innerHTML = contentHTML;
    })
    .catch(error => {
        // Handle errors
        console.error('Error in explainCode:', error);
        // Additional error handling can be added here if needed
    });
}

// Function to handle text selection
function handleSelection(event) {
  const selectedText = window.getSelection().toString();

  if (selectedText) {
    // Display options when text is selected
    const confirmation = confirm(`Selected text: "${selectedText}"\n\nDo you want to prompt ChatGPT?`);
    if (confirmation) {
      getChatGPTResponse(selectedText).then(data => {
        // Convert response to pdf
        console.log("Response: ", data);
        const message = data.choices[0].message.content;
        generatePDF(message);
      })
      .catch(error => {
        // Handle errors
        console.error('Error in explainCode:', error);
        // Additional error handling can be added here if needed
    })
    }
  }
}

function generatePDF(content) {
    // Create a new PDF document
    const doc = new window.jspdf.jsPDF();
    
    // Add the content to the PDF document
    doc.text(content, 10, 10);
  
    // Save the PDF file
    doc.save('response.pdf');
}

// Add event listener to detect text selection
document.addEventListener('mouseup', handleSelection);

  
