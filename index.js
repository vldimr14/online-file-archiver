let files = [];

function dropHandler(event) {
    console.log('File(s) dropped');

    // Prevent default behavior. Prevent file from being opened.
    event.preventDefault(); 

    if (event.dataTransfer.items) {
        // Access the files using DataTransferItemList interface.
        [...event.dataTransfer.items].forEach((item, i) => {
            // If drop files are not files, reject them.
            if (item.kind === 'file') {
                let file = item.getAsFile();
                let fileSizeInMB = file.size / 1000000;
                let roundedNumber = Number(fileSizeInMB.toFixed(2));
                files.push(file);
                console.log(`... file[${i}].name = ${file.name}, type = ${file.type}, size = ${roundedNumber}MB`);
            }
        });
    } else {
        // Use DataTransfer interface to access the file(s).
        [...event.dataTransfer.files].forEach((file, i) => {
            console.log(`... file[${i}].name = ${file.name}`);
        });
    }

    render(templateFunction, document.querySelector('#main-content'));
}

function dragOverHandler(event) {
    console.log('File(s) in drop zone.');

    // Prevent default behavior. Prevent file from being opened.
    event.preventDefault();
}

// Functions related to view render.

let render = function (template, node) {
    if (!node) return;
    // check if template is a string or function. If it's function, run it.
    node.innerHTML = (typeof template === 'function' ? template() : template);
}

let someData = {
    page: 'about'
};

someData.page = 'about';

const uploadFilesTemplate = ` 
        <div class="main-content container justify-content-center align-items-center">
            <div class="file-zone container justify-content-center align-items-center text-center">
                <div 
                    class="file-zone-elements" 
                    id="drop_zone" 
                    ondrop="dropHandler(event);"
                    ondragover="dragOverHandler(event);">
                    <div class="display-6">Drag files here <br> or</div>
                    <input type="file" class="uploadFileInput" multiple="true">
                </div>
            </div>
        </div>`;


function getTableView() {
    if (files.length > 0) {
        let tableViewStart = `<div class="main-content container justify-content-center table-content">
            <table class="table table-hover">
                <caption>Uploaded files</caption>
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Type</th>
                        <th scope="col">Size (MB)</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">`;

        let tableRow = [];
        
        for(let i = 0; i < files.length; i++) {
            let index = i;
            tableRow[i] =  `<tr>
                        <th scope="row">${++index}</th>
                        <td>${files[i].name}</td>
                        <td>${files[i].type}</td>
                        <td>${Number((files[i].size / 1000000).toFixed(2))}</td>
                    </tr>`;
        }

        tableRow.join('');
        
        let tableViewEnd = `</tbody>
            </table>
        </div>`;

        return tableViewStart + tableRow + tableViewEnd;
    }
}


let templateFunction = function() {
    if (files.length > 0) {
        template = getTableView();
    } else {
        template = uploadFilesTemplate;
    }

    return template;
};

console.log(files.length);
render(templateFunction, document.querySelector('#main-content'));

