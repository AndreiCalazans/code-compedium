const fs = require('fs');


/*
Given a graphql_state.json file that has the following structure:

{
  "useCachedCountryCodeQuery": {
    "data": {
      "viewer": {
        "userProperties": {
          "country": {
            "code": "BR"
          },
          "id": "VXNlclByb3BlcnRpZXM6MA=="
        },
        "id": "Vmlld2VyOjA="
      }
    }
  },
  "useNativeCurrencyQuery": {
    "data": {
      "viewer": {
        "userProperties": {
          "nativeCurrency": "BRL",
          "id": "VXNlclByb3BlcnRpZXM6MA=="
        },
        "id": "Vmlld2VyOjA="
      }
    }
  },
}
It will output the fields that overlap between these two queries
*/

function extractPaths(obj, currentPath = '', parentKey = '') {
    let paths = [];

    for (const [key, value] of Object.entries(obj)) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;

        if (value !== null && typeof value === 'object') {
            // If it's an object or array, recurse
            paths = paths.concat(extractPaths(value, newPath, parentKey || key));
        } else {
            // If it's a primitive value, add the path with its parent key
            paths.push({ path: newPath, parentKey: parentKey || key });
        }
    }

    return paths;
}

function analyzeKeys(jsonData) {
    const allPaths = extractPaths(jsonData);
    const keyOccurrences = {};

    // Process each path
    allPaths.forEach(({ path, parentKey }) => {
        const parts = path.split('.');
        if (parts.length > 2) {
            let restOfKey = parts.slice(1).join('.');

            // Normalize array keys by removing numeric indices
            restOfKey = restOfKey.replace(/\.\d+(?=\.|$)/g, '');

            // If the key doesn't exist, initialize it with an empty set
            if (!keyOccurrences[restOfKey]) {
                keyOccurrences[restOfKey] = new Set();
            }

            // Add the parent key to the set
            keyOccurrences[restOfKey].add(parentKey);
        }
    });

    // Find and log repeated keys with different parent keys
    console.log("Repeated keys with different parent keys:");
    for (const [key, parentKeys] of Object.entries(keyOccurrences)) {
        if (parentKeys.size > 1) {
            console.log(`Key: ${key}`);
            console.log(`Parent keys: ${Array.from(parentKeys).join(', ')}`);
            console.log('---');
        }
    }
}

const inputFile = './graphql_state.json';
fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        const jsonData = JSON.parse(data);
        analyzeKeys(jsonData);
    } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
    }
});
