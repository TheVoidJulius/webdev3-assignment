const fs = require("fs");

console.log("File Manager");


fs.writeFile("sample.txt", "Hello! This is my file.", function(error) {

    if (error) {
        console.log("Error creating file");
        return;
    }

    console.log("File created successfully.");

    fs.readFile("sample.txt", "utf8", function(error, data) {

        if (error) {
            console.log("Error reading file");
            return;
        }

        console.log("File content:", data);

        
        fs.appendFile(
            "sample.txt",
            "\nThis is the updated content.",
            function(error) {

                if (error) {
                    console.log("Error updating file");
                    return;
                }

                console.log("File updated successfully.");

               
                fs.unlink("sample.txt", function(error) {

                    if (error) {
                        console.log("Error deleting file");
                        return;
                    }

                    console.log("File deleted successfully.");
                });
            }
        );
    });
});