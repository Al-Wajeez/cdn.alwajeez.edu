document.addEventListener('DOMContentLoaded', function() {
    var currentDateElement = document.getElementById('currentDate');
    var currentTimeElement = document.getElementById('currentTime');

    function updateDateTime() {
        var now = new Date();
        var dateOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        var timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        var date = now.toLocaleDateString('ar', dateOptions);
        var time = now.toLocaleTimeString('ar', timeOptions);
        currentDateElement.innerText = date;
        currentTimeElement.innerText = time;
    }

    updateDateTime(); // Initial update
    setInterval(updateDateTime, 1000); // Update every second
});

// Add event listener for when the page is loaded
window.addEventListener('load', function() {
    // Hide the section by setting its display property to none
    $('.edu-about-area').hide();
    $('.course-details-area').hide();
    $('.edu-Achievement-area').hide();
    $('.edu-Ranking-area').hide();
    $('.section-button').hide();
});

document.addEventListener("DOMContentLoaded", function() {
    const dropArea = document.getElementById("dropArea");

    // Prevent default behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop area on drag over
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    // Unhighlight drop area on drag leave
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    // Handle file drop
    dropArea.addEventListener('drop', handleDrop, false);

    // Click event to trigger file input
    dropArea.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = ".xlsx, .xls";
        fileInput.onchange = handleFileInputChange;
        fileInput.multiple = true; // Enable multiple file selection
        fileInput.click();
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        dropArea.classList.add('highlight');
    }

    function unhighlight() {
        dropArea.classList.remove('highlight');
    }

    function handleDrop(e) {
        const files = e.dataTransfer.files;
        handleFiles(files);
    }

    function handleFileInputChange(e) {
        const files = e.target.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            uploadFile(file);
        }
    }

    function appendDataToDataTable(newData) {
    const table = $('#data-table').DataTable();

        // Add the new data to the DataTable
        table.rows.add(newData).draw();
    }

    // Calculate the p-value using the t-statistic and degrees of freedom
    function ttestPValue(tValue, df) {
        // Calculate the cumulative distribution function (CDF) of the t-distribution
        const pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tValue), df));
        
        // If tValue is negative, use 1 - pValue to get the one-tailed p-value
        if (tValue < 0) {
            return 1 - pValue;
        }
        
        // If tValue is non-negative, use pValue directly
        return pValue;
    }

    function ttestDF(sample1, sample2) {
    // Ensure both samples have the same length
    if (sample1.length !== sample2.length) {
        throw new Error("Sample sizes must be equal for a paired sample t-test.");
    }
    // Degrees of freedom is the number of pairs - 1
    const df = sample1.length - 1;
    return df;
    }

    function uploadFile(file) {
        const progressCircle = document.getElementById('progressCircle');
        progressCircle.classList.remove('hidden');

        const uploadIcon = document.getElementById('uploadIcon');
        uploadIcon.classList.add('hidden');
        const successIcon = document.getElementById('successIcon');
        successIcon.classList.add('hidden');
        const uploadText = document.getElementById('uploadText');
        uploadText.textContent = '';

        let progress = 0;
        const interval = setInterval(() => {
            progressCircle.textContent = '';

            progress += 10;

            if (progress >= 100) {
                progressCircle.classList.add('hidden');
                successIcon.classList.remove('hidden');
                uploadText.textContent = 'لقد تم إستيراد البيانات بنجاح.';

           

                clearInterval(interval);

                //var reader = new FileReader();
                const reader = new FileReader();
                reader.onload = function(e) {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheet_name_list = workbook.SheetNames;
                    const worksheet = workbook.Sheets[sheet_name_list[0]];
         

                    const columnsToImport = ['الرقم', 'اللقب و الاسم', 'تاريخ الميلاد', 'الجنس', 'الإعادة', 'اللغة العربية ف 1', 'اللغة العربية ف 2', 'اللغة اﻷمازيغية ف 1', 'اللغة اﻷمازيغية ف 2', 'اللغة الفرنسية ف 1', 'اللغة الفرنسية ف 2', 'اللغة الإنجليزية ف 1', 'اللغة الإنجليزية ف 2', 'التربية الإسلامية ف 1', 'التربية الإسلامية ف 2', 'التربية المدنية ف 1', 'التربية المدنية ف 2', 'التاريخ والجغرافيا ف 1', 'التاريخ والجغرافيا ف 2', 'الرياضيات ف 1', 'الرياضيات ف 2', 'ع الطبيعة و الحياة ف 1', 'ع الطبيعة و الحياة ف 2', 'ع الفيزيائية والتكنولوجيا ف 1', 'ع الفيزيائية والتكنولوجيا ف 2', 'المعلوماتية ف 1', 'المعلوماتية ف 2', 'التربية التشكيلية ف 1', 'التربية التشكيلية ف 2', 'التربية الموسيقية ف 1', 'التربية الموسيقية ف 2', 'ت البدنية و الرياضية ف 1', 'ت البدنية و الرياضية ف 2', 'معدل الفصل 1', 'معدل الفصل 2', 'القسم'];
                    // Get cell A5 value
                    const cellA5 = worksheet['A5'].v;
                    const lastTwoDigits = cellA5.substring(cellA5.length - 2);

                    const json_data = XLSX.utils.sheet_to_json(worksheet, { range: 6, header: 1, raw: false, dateNF: 'dd/mm/yyyy', defval: null, blankrows: false, dateNF: 'dd/mm/yyyy', header: columnsToImport });

                    // Remove the last row from json_data
                    json_data.pop();

                    // Add lastTwoDigits to each row in column 24 ('القسم')
                    json_data.forEach(function(row) {
                    row['القسم'] = lastTwoDigits; // Assuming 'القسم' is the Arabic name for the 'alpha' column
                    });

                    if ($.fn.DataTable.isDataTable('#data-table')) {
                        //$('#data-table').DataTable().destroy();
                        // Append data to existing DataTable
                        appendDataToDataTable(json_data);
                    } else {
                        // Initialize DataTable if it's not initialized yet
                         loadDataTable(json_data);
                    }


                // Show the pop-up modal after successful data loading
                const popupmodal = document.getElementById('popupModal');
                popupmodal.style.display = "block";
                    
                };
                reader.readAsArrayBuffer(file);

            }
        }, 300);
    }

    function loadDataTable(data) {
        var table = $('#data-table').DataTable({
            dom: 'Bfrtip',
            destroy: true,
            responsive: true,
            data: data,
            //rowReorder: true,
            rowGroup: false,
            fixedHeader: true,
            scrollX: false,
            //savedStates: true,
            //keys: true,
            //select: true,
            //autoFill: true,


            columnDefs: [
                    {
                    targets: 35,
                    render: function(data, type, row, meta) {
                        try {
                            var scienceTech = parseFloat(row['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                            var natureLife = parseFloat(row['ع الطبيعة و الحياة ف 2']) || 0;
                            var mathematics = parseFloat(row['الرياضيات ف 2']) || 0;
                            var arabic = parseFloat(row['اللغة العربية ف 2']) || 0;
                            var value = ((scienceTech * 4) + (natureLife * 4) + (mathematics * 4) + (arabic * 2)) / 14;
                            return value.toFixed(2);
                        } catch (error) {
                            // If an error occurs (e.g., column data is missing), return an empty string
                            return '';
                        }
                    }
                },
                {
                    targets: 36,
                    render: function(data, type, row, meta) {
                        var arabic = parseFloat(row['اللغة العربية ف 2']) || 0;
                        var french = parseFloat(row['اللغة الفرنسية ف 2']) || 0;
                        var english = parseFloat(row['اللغة الإنجليزية ف 2']) || 0;
                        var history = parseFloat(row['التاريخ والجغرافيا ف 2']) || 0;
                        var value = ((arabic * 5) + (french * 4) + (english * 3) + (history * 2)) / 14;
                        return value.toFixed(2);
                    }
                },
                {

                    targets: 37,

                    render: function(data, type, row, meta) {
                        var arabic = parseFloat(row['اللغة العربية ف 2']) || 0;
                        var french = parseFloat(row['اللغة الفرنسية ف 2']) || 0;
                        var english = parseFloat(row['اللغة الإنجليزية ف 2']) || 0;
                        var history = parseFloat(row['التاريخ والجغرافيا ف 2']) || 0;
                        var TCT = ((arabic * 5) + (french * 4) + (english * 3) + (history * 2)) / 14;
                        var scienceTech = parseFloat(row['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                        var natureLife = parseFloat(row['ع الطبيعة و الحياة ف 2']) || 0;
                        var mathematics = parseFloat(row['الرياضيات ف 2']) || 0;
                        var TCL = ((scienceTech * 4) + (natureLife * 4) + (mathematics * 4) + (arabic * 2)) / 14;
                        var Orientation = '-';
                        if (TCT > TCL) {
                            Orientation = 'جذع مشترك آداب';
                        } else if (TCT < TCL) {
                            Orientation = 'جذع مشترك علوم وتكنولوجيا';
                        } else {
                            Orientation = '-';
                        }
                        return Orientation;

                    }

                },
                {
                    targets: [2, 5, 6, 7, 8, 9, 10 ,11 ,12 ,13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
                    visible: false
                },
                {
                    targets: '_all',
                    className: 'dt-body-center'
                }
            ],
            order: [[38, "asc"]],
            columns: [
                { data: 'الرقم' },
                { data: 'اللقب و الاسم' },
                { 
                    data: 'تاريخ الميلاد',
                    render: function(data, type, row) {
                        if (type === 'sort' || type === 'type') {
                            return data;
                        }
                        var date = new Date(data);
                        var day = date.getDate();
                        var month = date.getMonth() + 1;
                        var year = date.getFullYear();
                        return (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + year;
                    }
                },
                { data: 'الجنس' },
                { data: 'الإعادة' },
                { data: 'اللغة العربية ف 1' },
                { data: 'اللغة العربية ف 2' },
                { data: 'اللغة اﻷمازيغية ف 1' },
                { data: 'اللغة اﻷمازيغية ف 2' },
                { data: 'اللغة الفرنسية ف 1' },
                { data: 'اللغة الفرنسية ف 2' },
                { data: 'اللغة الإنجليزية ف 1' },
                { data: 'اللغة الإنجليزية ف 2' },
                { data: 'التربية الإسلامية ف 1' },
                { data: 'التربية الإسلامية ف 2' },
                { data: 'التربية المدنية ف 1' },
                { data: 'التربية المدنية ف 2' },
                { data: 'التاريخ والجغرافيا ف 1' },
                { data: 'التاريخ والجغرافيا ف 2' },
                { data: 'الرياضيات ف 1' },
                { data: 'الرياضيات ف 2' },
                { data: 'ع الطبيعة و الحياة ف 1' },
                { data: 'ع الطبيعة و الحياة ف 2' },
                { data: 'ع الفيزيائية والتكنولوجيا ف 1' },
                { data: 'ع الفيزيائية والتكنولوجيا ف 2' },
                { data: 'المعلوماتية ف 1' },
                { data: 'المعلوماتية ف 2' },
                { data: 'التربية التشكيلية ف 1' },
                { data: 'التربية التشكيلية ف 2' },
                { data: 'التربية الموسيقية ف 1' },
                { data: 'التربية الموسيقية ف 2' },
                { data: 'ت البدنية و الرياضية ف 1' },
                { data: 'ت البدنية و الرياضية ف 2' },
                { data: 'معدل الفصل 2' },
                { data: 'معدل الفصل 2' },
                { data: null },
                { data: null },
                { data: null },
                { data: 'القسم' },
            ],

            buttons: [
                {
                    text: '',
                    extend: 'copy',
                },

                {
                    text: '',
                    extend: 'excel',
                },

                {
                    text: '',
                    extend: 'print',
                    exportOptions:{
                    columns: ':visible',
                    autoPrint: true,
                    orientation: 'landscape',
                    pageSize: 'A4',
                    }
                },

                {
                text: '',
                extend:'pageLength'
                }
            ],

            // Language setting
            language: {
                "decimal": "",
                "emptyTable": "لا توجد بيانات متاحة في الجدول",
                "info": "إظهار  _START_ إلى _END_ من أصل _TOTAL_ تلميذ",
                "infoEmpty": "عرض 0 إلى 0 من 0 لميذ",
                "infoFiltered": "(تمت تصفيته _MAX_ التلاميذ)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "عرض _MENU_ تلميذ",
                "loadingRecords": "تحميل...",
                "processing": "",
                "search": "البحث:",
                "zeroRecords": "لم يتم العثور على بيانات مطابقة",
                "paginate": {
                    "first": "الأول",
                    "last": "الأخير",
                    "next": "التالي",
                    "previous": "السابق"
                },
                "aria": {
                    "orderable": "الترتيب حسب هذا العمود",
                    "orderableReverse": "ترتيب عكسي لهذا العمود"
                }
                }
        });

         // Initialize column search inputs
        $('#data-table tfoot th').each(function () {
            var title = $(this).text();
            $(this).html('<input type="text" placeholder="' + title + '" />');
        });

        // Apply the search
        table.columns().every(function () {
            var that = this;

            $('input', this.footer()).on('keyup change', function () {
                if (that.search() !== this.value) {
                    that
                        .search(this.value)
                        .draw();
                }
            });
        });

        // Set the page length and redraw the table (Filter)
        $('.edu-select').on('change', function() {
            var selectedOption = $(this).val();
            var splitOption = selectedOption.split(' ');
            var pageLength = parseInt(splitOption[0]);
            var table = $('#data-table').DataTable();
            table.page.len(pageLength).draw(); // Set the page length and redraw the table
        });

 
        function performCalculation() {

        // Hide Drag and Drop Area
        $('.edu-categorie-area').hide();
        // unhide Analyse Area
        $('.edu-about-area').show();
        $('.course-details-area').show();
        $('.edu-Achievement-area').show();
        $('.edu-Ranking-area').show();
        $('.section-button').show();
        // Count the number of values greater than 1
        let countarabicGreaterThanOne = 0;
        let countamazighGreaterThanOne = 0;
        let countfrenchGreaterThanOne = 0;
        let countenglishGreaterThanOne = 0;
        let countislamicGreaterThanOne = 0;
        let countcivicsGreaterThanOne = 0;
        let counthistoryandgeographyGreaterThanOne = 0;
        let countmathGreaterThanOne = 0;
        let countnatureGreaterThanOne = 0;
        let countphysicalGreaterThanOne = 0;
        let countinformaticsGreaterThanOne = 0;
        let countfineGreaterThanOne = 0;
        let countmusicGreaterThanOne = 0;
        let countathleticGreaterThanOne = 0;
        let countrateGreaterThanOne = 0;

        table.rows().every(function() {
            const rowData = this.data();
            const arabicValue = parseFloat(rowData['اللغة العربية ف 2']) || 0;
            const amazighValue = parseFloat(rowData['اللغة اﻷمازيغية ف 2']) || 0;
            const frenchValue = parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
            const englishValue = parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
            const islamicValue = parseFloat(rowData['التربية الإسلامية ف 2']) || 0;
            const civicsValue = parseFloat(rowData['التربية المدنية ف 2']) || 0;
            const historyandgeographyValue = parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
            const mathValue = parseFloat(rowData['الرياضيات ف 2']) || 0;
            const natureValue = parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
            const physicalValue = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
            const informaticsValue = parseFloat(rowData['المعلوماتية ف 2']) || 0;
            const fineValue = parseFloat(rowData['التربية التشكيلية ف 2']) || 0;
            const musicValue = parseFloat(rowData['التربية الموسيقية ف 2']) || 0;
            const athleticValue = parseFloat(rowData['ت البدنية و الرياضية ف 2']) || 0;
            const rateValue = parseFloat(rowData['معدل الفصل 2']) || 0;

            if (arabicValue >= 1) {
                countarabicGreaterThanOne++;
            }
            if (amazighValue >= 1) {
                countamazighGreaterThanOne++;
            }
            if (frenchValue >= 1) {
                countfrenchGreaterThanOne++;
            }
            if (englishValue >= 1) {
                countenglishGreaterThanOne++;
            }
            if (islamicValue >= 1) {
                countislamicGreaterThanOne++;
            }
            if (civicsValue >= 1) {
                countcivicsGreaterThanOne++;
            }
            if (historyandgeographyValue > 1) {
                counthistoryandgeographyGreaterThanOne++;
            }
            if (mathValue >= 1) {
                countmathGreaterThanOne++;
            }
            if (natureValue >= 1) {
                countnatureGreaterThanOne++;
            }
            if (physicalValue >= 1) {
                countphysicalGreaterThanOne++;
            }
            if (informaticsValue >= 1) {
                countinformaticsGreaterThanOne++;
            }
            if (fineValue >= 1) {
                countfineGreaterThanOne++;
            }
            if (musicValue >= 1) {
                countmusicGreaterThanOne++;
            }
            if (athleticValue >= 1) {
                countathleticGreaterThanOne++;
            }
            if (rateValue >= 1) {
                countrateGreaterThanOne++;
            }

            return true;
        });

            $('#arabic-count').text(countarabicGreaterThanOne);
            $('#Amazigh-count').text(countamazighGreaterThanOne);
            $('#french-count').text(countfrenchGreaterThanOne);
            $('#english-count').text(countenglishGreaterThanOne);
            $('#islamic-count').text(countislamicGreaterThanOne);
            $('#civics-count').text(countcivicsGreaterThanOne);
            $('#historyandgeography-count').text(counthistoryandgeographyGreaterThanOne);
            $('#math-count').text(countmathGreaterThanOne);
            $('#nature-count').text(countnatureGreaterThanOne);
            $('#physical-count').text(countphysicalGreaterThanOne);
            $('#informatics-count').text(countinformaticsGreaterThanOne);
            $('#fine-count').text(countfineGreaterThanOne);
            $('#music-count').text(countmusicGreaterThanOne);
            $('#athletic-count').text(countathleticGreaterThanOne);
            $('#rate-count').text(countrateGreaterThanOne);

            // Initialize variables to hold the sum of values for each subject
            let sumArabic = 0;
            let sumAmazigh = 0;
            let sumFrench = 0;
            let sumEnglish = 0;
            let sumIslamic = 0;
            let sumCivics = 0;
            let sumHistoryAndGeography = 0;
            let sumMath = 0;
            let sumNature = 0;
            let sumPhysical = 0;
            let sumInformatics = 0;
            let sumFine = 0;
            let sumMusic = 0;
            let sumAthletic = 0;
            let sumRate = 0;

            // Count the total number of rows
            let totalRows = table.rows().count();

            // Iterate over each row to sum up the values for each subject
            table.rows().every(function() {
                const rowData = this.data();
                sumArabic += parseFloat(rowData['اللغة العربية ف 2']) || 0;
                sumAmazigh += parseFloat(rowData['اللغة اﻷمازيغية ف 2']) || 0;
                sumFrench += parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
                sumEnglish += parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
                sumIslamic += parseFloat(rowData['التربية الإسلامية ف 2']) || 0;
                sumCivics += parseFloat(rowData['التربية المدنية ف 2']) || 0;
                sumHistoryAndGeography += parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
                sumMath += parseFloat(rowData['الرياضيات ف 2']) || 0;
                sumNature += parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
                sumPhysical += parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                sumInformatics += parseFloat(rowData['المعلوماتية ف 2']) || 0;
                sumFine += parseFloat(rowData['التربية التشكيلية ف 2']) || 0;
                sumMusic += parseFloat(rowData['التربية الموسيقية ف 2']) || 0;
                sumAthletic += parseFloat(rowData['ت البدنية و الرياضية ف 2']) || 0;
                sumRate += parseFloat(rowData['معدل الفصل 2']) || 0;

                return true;
            });

            // Calculate the mean (average) for each subject
            let meanArabic = sumArabic / totalRows;
            let meanAmazigh = sumAmazigh / totalRows;
            let meanFrench = sumFrench / totalRows;
            let meanEnglish = sumEnglish / totalRows;
            let meanIslamic = sumIslamic / totalRows;
            let meanCivics = sumCivics / totalRows;
            let meanHistoryAndGeography = sumHistoryAndGeography / totalRows;
            let meanMath = sumMath / totalRows;
            let meanNature = sumNature / totalRows;
            let meanPhysical = sumPhysical / totalRows;
            let meanInformatics = sumInformatics / totalRows;
            let meanFine = sumFine / totalRows;
            let meanMusic = sumMusic / totalRows;
            let meanAthletic = sumAthletic / totalRows;
            let meanRate = sumRate / totalRows;

            // Update the content of the <td> elements with the means
            $('#arabic-mean, #arabic-meanDiff').text(meanArabic.toFixed(2));
            $('#amazigh-mean, #amazigh-meanDiff').text(meanAmazigh.toFixed(2));
            $('#french-mean, #french-meanDiff').text(meanFrench.toFixed(2));
            $('#english-mean, #english-meanDiff').text(meanEnglish.toFixed(2));
            $('#islamic-mean, #islamic-meanDiff').text(meanIslamic.toFixed(2));
            $('#civics-mean, #civics-meanDiff').text(meanCivics.toFixed(2));
            $('#historyandgeography-mean, #historyandgeography-meanDiff').text(meanHistoryAndGeography.toFixed(2));
            $('#math-mean, #math-meanDiff').text(meanMath.toFixed(2));
            $('#nature-mean, #nature-meanDiff').text(meanNature.toFixed(2));
            $('#physical-mean, #physical-meanDiff').text(meanPhysical.toFixed(2));
            $('#informatics-mean, #informatics-meanDiff').text(meanInformatics.toFixed(2));
            $('#fine-mean, #fine-meanDiff').text(meanFine.toFixed(2));
            $('#music-mean, #music-meanDiff').text(meanMusic.toFixed(2));
            $('#athletic-mean, #athletic-meanDiff').text(meanAthletic.toFixed(2));
            $('#rate-mean, #rate-meanDiff').text(meanRate.toFixed(2));

            // Add badge dynamically based on mean value
            addBadge('#arabic-mean', meanArabic);
            addBadge('#amazigh-mean', meanAmazigh);
            addBadge('#french-mean', meanFrench);
            addBadge('#english-mean', meanEnglish);
            addBadge('#islamic-mean', meanIslamic);
            addBadge('#civics-mean', meanCivics);
            addBadge('#historyandgeography-mean', meanHistoryAndGeography);
            addBadge('#math-mean', meanMath);
            addBadge('#nature-mean', meanNature);
            addBadge('#physical-mean', meanPhysical);
            addBadge('#informatics-mean', meanInformatics);
            addBadge('#fine-mean', meanFine);
            addBadge('#music-mean', meanMusic);
            addBadge('#athletic-mean', meanAthletic);
            addBadge('#rate-mean', meanRate);

            function addBadge(selector, mean) {
                if (mean >=1 && mean < 10) {
                    $(selector).append('<span class="badge-1" title="تحصل التلاميذ على معدل أو نسبة تقل عن المتوسط">ضعيف</span>');
                }
            }


            // Initialize variables to hold the sum of squared differences for each subject
            let sumSquaredDiffArabic = 0;
            let sumSquaredDiffAmazigh = 0;
            let sumSquaredDiffFrench = 0;
            let sumSquaredDiffEnglish = 0;
            let sumSquaredDiffIslamic = 0;
            let sumSquaredDiffCivics = 0;
            let sumSquaredDiffHistoryAndGeography = 0;
            let sumSquaredDiffMath = 0;
            let sumSquaredDiffNature = 0;
            let sumSquaredDiffPhysical = 0;
            let sumSquaredDiffInformatics = 0;
            let sumSquaredDiffFine = 0;
            let sumSquaredDiffMusic = 0;
            let sumSquaredDiffAthletic = 0;
            let sumSquaredDiffRate = 0;

            // Iterate over each row to sum up the squared differences for each subject
            table.rows().every(function() {
                const rowData = this.data();
                const arabicValue = parseFloat(rowData['اللغة العربية ف 2']) || 0;
                const amazighValue = parseFloat(rowData['اللغة اﻷمازيغية ف 2']) || 0;
                const frenchValue = parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
                const englishValue = parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
                const islamicValue = parseFloat(rowData['التربية الإسلامية ف 2']) || 0;
                const civicsValue = parseFloat(rowData['التربية المدنية ف 2']) || 0;
                const historyandgeographyValue = parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
                const mathValue = parseFloat(rowData['الرياضيات ف 2']) || 0;
                const natureValue = parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
                const physicalValue = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                const informaticsValue = parseFloat(rowData['المعلوماتية ف 2']) || 0;
                const fineValue = parseFloat(rowData['التربية التشكيلية ف 2']) || 0;
                const musicValue = parseFloat(rowData['التربية الموسيقية ف 2']) || 0;
                const athleticValue = parseFloat(rowData['ت البدنية و الرياضية ف 2']) || 0;
                const rateValue = parseFloat(rowData['معدل الفصل 2']) || 0;

                // Calculate the squared differences and add them to the sum
                sumSquaredDiffArabic += Math.pow(arabicValue - meanArabic, 2);
                sumSquaredDiffAmazigh += Math.pow(amazighValue - meanAmazigh, 2);
                sumSquaredDiffFrench += Math.pow(frenchValue - meanFrench, 2);
                sumSquaredDiffEnglish += Math.pow(englishValue - meanEnglish, 2);
                sumSquaredDiffIslamic += Math.pow(islamicValue - meanIslamic, 2);
                sumSquaredDiffCivics += Math.pow(civicsValue - meanCivics, 2);
                sumSquaredDiffHistoryAndGeography += Math.pow(historyandgeographyValue - meanHistoryAndGeography, 2);
                sumSquaredDiffMath += Math.pow(mathValue - meanMath, 2);
                sumSquaredDiffNature += Math.pow(natureValue - meanNature, 2);
                sumSquaredDiffPhysical += Math.pow(physicalValue - meanPhysical, 2);
                sumSquaredDiffInformatics += Math.pow(informaticsValue - meanInformatics, 2);
                sumSquaredDiffFine += Math.pow(fineValue - meanFine, 2);
                sumSquaredDiffMusic += Math.pow(musicValue - meanMusic, 2);
                sumSquaredDiffAthletic += Math.pow(athleticValue - meanAthletic, 2);
                sumSquaredDiffRate += Math.pow(rateValue - meanRate, 2);

                return true;
            });

            // Calculate the mean of the squared differences for each subject
            let meanSquaredDiffArabic = sumSquaredDiffArabic /  (totalRows - 1);
            let meanSquaredDiffAmazigh = sumSquaredDiffAmazigh /  (totalRows - 1);
            let meanSquaredDiffFrench = sumSquaredDiffFrench /  (totalRows - 1);
            let meanSquaredDiffEnglish = sumSquaredDiffEnglish /  (totalRows - 1);
            let meanSquaredDiffIslamic = sumSquaredDiffIslamic /  (totalRows - 1);
            let meanSquaredDiffCivics = sumSquaredDiffCivics /  (totalRows - 1);
            let meanSquaredDiffHistoryAndGeography = sumSquaredDiffHistoryAndGeography /  (totalRows - 1);
            let meanSquaredDiffMath = sumSquaredDiffMath /  (totalRows - 1);
            let meanSquaredDiffNature = sumSquaredDiffNature /  (totalRows - 1);
            let meanSquaredDiffPhysical = sumSquaredDiffPhysical /  (totalRows - 1);
            let meanSquaredDiffInformatics = sumSquaredDiffInformatics /  (totalRows - 1);
            let meanSquaredDiffFine = sumSquaredDiffFine /  (totalRows - 1);
            let meanSquaredDiffMusic = sumSquaredDiffMusic /  (totalRows - 1);
            let meanSquaredDiffAthletic = sumSquaredDiffAthletic /  (totalRows - 1);
            let meanSquaredDiffRate = sumSquaredDiffRate /  (totalRows - 1);

            // Calculate the standard deviation for each subject
            let stdvArabic = Math.sqrt(meanSquaredDiffArabic);
            let stdvAmazigh = Math.sqrt(meanSquaredDiffAmazigh);
            let stdvFrench = Math.sqrt(meanSquaredDiffFrench);
            let stdvEnglish = Math.sqrt(meanSquaredDiffEnglish);
            let stdvIslamic = Math.sqrt(meanSquaredDiffIslamic);
            let stdvCivics = Math.sqrt(meanSquaredDiffCivics);
            let stdvHistoryAndGeography = Math.sqrt(meanSquaredDiffHistoryAndGeography);
            let stdvMath = Math.sqrt(meanSquaredDiffMath);
            let stdvNature = Math.sqrt(meanSquaredDiffNature);
            let stdvPhysical = Math.sqrt(meanSquaredDiffPhysical);
            let stdvInformatics = Math.sqrt(meanSquaredDiffInformatics);
            let stdvFine = Math.sqrt(meanSquaredDiffFine);
            let stdvMusic = Math.sqrt(meanSquaredDiffMusic);
            let stdvAthletic = Math.sqrt(meanSquaredDiffAthletic);
            let stdvRate = Math.sqrt(meanSquaredDiffRate);

            // Update the content of the <td> elements with the standard deviations
            $('#arabic-stdv').text(stdvArabic.toFixed(2));
            $('#amazigh-stdv').text(stdvAmazigh.toFixed(2));
            $('#french-stdv').text(stdvFrench.toFixed(2));
            $('#english-stdv').text(stdvEnglish.toFixed(2));
            $('#islamic-stdv').text(stdvIslamic.toFixed(2));
            $('#civics-stdv').text(stdvCivics.toFixed(2));
            $('#historyandgeography-stdv').text(stdvHistoryAndGeography.toFixed(2));
            $('#math-stdv').text(stdvMath.toFixed(2));
            $('#nature-stdv').text(stdvNature.toFixed(2));
            $('#physical-stdv').text(stdvPhysical.toFixed(2));
            $('#informatics-stdv').text(stdvInformatics.toFixed(2));
            $('#fine-stdv').text(stdvFine.toFixed(2));
            $('#music-stdv').text(stdvMusic.toFixed(2));
            $('#athletic-stdv').text(stdvAthletic.toFixed(2));
            $('#rate-stdv').text(stdvRate.toFixed(2));

            // Count the number of values greater than 1 in 'اللغة العربية' and 'اللغة اﻷمازيغية'
            let countarabicGreaterThanTen = 0;
            let countamazighGreaterThanTen = 0;
            let countfrenchGreaterThanTen = 0;
            let countenglishGreaterThanTen = 0;
            let countislamicGreaterThanTen = 0;
            let countcivicsGreaterThanTen = 0;
            let counthistoryandgeographyGreaterThanTen = 0;
            let countmathGreaterThanTen = 0;
            let countnatureGreaterThanTen = 0;
            let countphysicalGreaterThanTen = 0;
            let countinformaticsGreaterThanTen = 0;
            let countfineGreaterThanTen = 0;
            let countmusicGreaterThanTen = 0;
            let countathleticGreaterThanTen = 0;
            let countrateGreaterThanTen = 0;

            table.rows().every(function() {
                const rowData = this.data();

                // Calculate the total number of rows
                const totalRows = table.rows().count();

                const arabicValue = parseFloat(rowData['اللغة العربية ف 2']) || 0;
                const amazighValue = parseFloat(rowData['اللغة اﻷمازيغية ف 2']) || 0;
                const frenchValue = parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
                const englishValue = parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
                const islamicValue = parseFloat(rowData['التربية الإسلامية ف 2']) || 0;
                const civicsValue = parseFloat(rowData['التربية المدنية ف 2']) || 0;
                const historyandgeographyValue = parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
                const mathValue = parseFloat(rowData['الرياضيات ف 2']) || 0;
                const natureValue = parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
                const physicalValue = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                const informaticsValue = parseFloat(rowData['المعلوماتية ف 2']) || 0;
                const fineValue = parseFloat(rowData['التربية التشكيلية ف 2']) || 0;
                const musicValue = parseFloat(rowData['التربية الموسيقية ف 2']) || 0;
                const athleticValue = parseFloat(rowData['ت البدنية و الرياضية ف 2']) || 0;
                const rateValue = parseFloat(rowData['معدل الفصل 2']) || 0;

                if (arabicValue >= 10) {
                    countarabicGreaterThanTen++;
                }
                if (amazighValue >= 10) {
                    countamazighGreaterThanTen++;
                }
                if (frenchValue >= 10) {
                    countfrenchGreaterThanTen++;
                }
                if (englishValue >= 10) {
                    countenglishGreaterThanTen++;
                }
                if (islamicValue >= 10) {
                    countislamicGreaterThanTen++;
                }
                if (civicsValue >= 10) {
                    countcivicsGreaterThanTen++;
                }
                if (historyandgeographyValue >= 10) {
                    counthistoryandgeographyGreaterThanTen++;
                }
                if (mathValue >= 10) {
                    countmathGreaterThanTen++;
                }
                if (natureValue >= 10) {
                    countnatureGreaterThanTen++;
                }
                if (physicalValue >= 10) {
                    countphysicalGreaterThanTen++;
                }
                if (informaticsValue >= 10) {
                    countinformaticsGreaterThanTen++;
                }
                if (fineValue >= 10) {
                    countfineGreaterThanTen++;
                }
                if (musicValue >= 10) {
                    countmusicGreaterThanTen++;
                }
                if (athleticValue >= 10) {
                    countathleticGreaterThanTen++;
                }
                if (rateValue >= 10) {
                    countrateGreaterThanTen++;
                }        

                return true;


            });

                // Calculate the percentage of values greater than or equal to 10 for each subject
                const percentageArabicGreaterThanTen = (countarabicGreaterThanTen / totalRows) * 100;
                const percentageAmazighGreaterThanTen = (countamazighGreaterThanTen / totalRows) * 100;
                const percentageFrenchGreaterThanTen = (countfrenchGreaterThanTen / totalRows) * 100;
                const percentageEnglishGreaterThanTen = (countenglishGreaterThanTen / totalRows) * 100;
                const percentageIslamicGreaterThanTen = (countislamicGreaterThanTen / totalRows) * 100;
                const percentageCivicsGreaterThanTen = (countcivicsGreaterThanTen / totalRows) * 100;
                const percentageHistoryAndGeographyGreaterThanTen = (counthistoryandgeographyGreaterThanTen / totalRows) * 100;
                const percentageMathGreaterThanTen = (countmathGreaterThanTen / totalRows) * 100;
                const percentageNatureGreaterThanTen = (countnatureGreaterThanTen / totalRows) * 100;
                const percentagePhysicalGreaterThanTen = (countphysicalGreaterThanTen / totalRows) * 100;
                const percentageInformaticsGreaterThanTen = (countinformaticsGreaterThanTen / totalRows) * 100;
                const percentageFineGreaterThanTen = (countfineGreaterThanTen / totalRows) * 100;
                const percentageMusicGreaterThanTen = (countmusicGreaterThanTen / totalRows) * 100;
                const percentageAthleticGreaterThanTen = (countathleticGreaterThanTen / totalRows) * 100;
                const percentageRateGreaterThanTen = (countrateGreaterThanTen / totalRows) * 100;

                if (percentageArabicGreaterThanTen >= 50) {
                    $('#arabic-Note, #arabic-NoteSucces').text("مقبول");
                } else if (percentageArabicGreaterThanTen > 1 && percentageArabicGreaterThanTen <= 49.99) {
                    $('#arabic-Note, #arabic-NoteSucces').text("للمعالجة");
                } else {
                    $('#arabic-Note, #arabic-NoteSucces').text("-");
                }
                if (percentageAmazighGreaterThanTen >= 50) {
                    $('#amazigh-Note, #amazigh-NoteSucces').text("مقبول");
                } else if (percentageAmazighGreaterThanTen > 1 && percentageAmazighGreaterThanTen <= 49.99) {
                    $('#amazigh-Note, #amazigh-NoteSucces').text("للمعالجة");
                } else {
                    $('#amazigh-Note, #amazigh-NoteSucces').text("-");
                }
                if (percentageFrenchGreaterThanTen >= 50) {
                    $('#french-Note, #french-NoteSucces').text("مقبول");
                } else if (percentageFrenchGreaterThanTen > 1 && percentageFrenchGreaterThanTen <= 49.99) {
                    $('#french-Note, #french-NoteSucces').text("للمعالجة");
                } else {
                    $('#french-Note, #french-NoteSucces').text("-");
                }
                if (percentageEnglishGreaterThanTen >= 50) {
                    $('#english-Note, #english-NoteSucces').text("مقبول");
                } else if (percentageEnglishGreaterThanTen > 1 && percentageEnglishGreaterThanTen <= 49.99) {
                    $('#english-Note, #english-NoteSucces').text("للمعالجة");
                } else {
                    $('#english-Note, #english-NoteSucces').text("-");
                }
                if (percentageIslamicGreaterThanTen >= 50) {
                    $('#islamic-Note, #islamic-NoteSucces').text("مقبول");
                } else if (percentageIslamicGreaterThanTen > 1 && percentageIslamicGreaterThanTen <= 49.99) {
                    $('#islamic-Note, #islamic-NoteSucces').text("للمعالجة");
                } else {
                    $('#islamic-Note, #islamic-NoteSucces').text("-");
                }
                if (percentageCivicsGreaterThanTen >= 50) {
                    $('#civics-Note, #civics-NoteSucces').text("مقبول");
                } else if (percentageCivicsGreaterThanTen > 1 && percentageCivicsGreaterThanTen <= 49.99) {
                    $('#civics-Note, #civics-NoteSucces').text("للمعالجة");
                } else {
                    $('#civics-Note, #civics-NoteSucces').text("-");
                }
                if (percentageHistoryAndGeographyGreaterThanTen >= 50) {
                    $('#historyandgeography-Note, #historyandgeography-NoteSucces').text("مقبول");
                } else if (percentageHistoryAndGeographyGreaterThanTen > 1 && percentageHistoryAndGeographyGreaterThanTen <= 49.99) {
                    $('#historyandgeography-Note, #historyandgeography-NoteSucces').text("للمعالجة");
                } else {
                    $('#historyandgeography-Note, #historyandgeography-NoteSucces').text("-");
                }
                if (percentageMathGreaterThanTen >= 50) {
                    $('#math-Note, #math-NoteSucces').text("مقبول");
                } else if (percentageMathGreaterThanTen > 1 && percentageMathGreaterThanTen <= 49.99) {
                    $('#math-Note, #math-NoteSucces').text("للمعالجة");
                } else {
                    $('#math-Note, #math-NoteSucces').text("-");
                }
                if (percentageNatureGreaterThanTen >= 50) {
                    $('#nature-Note, #nature-NoteSucces').text("مقبول");
                } else if (percentageNatureGreaterThanTen > 1 && percentageNatureGreaterThanTen <= 49.99) {
                    $('#nature-Note, #nature-NoteSucces').text("للمعالجة");
                } else {
                    $('#nature-Note, #nature-NoteSucces').text("-");
                }
                if (percentagePhysicalGreaterThanTen >= 50) {
                    $('#physical-Note, #physical-NoteSucces').text("مقبول");
                } else if (percentagePhysicalGreaterThanTen > 1 && percentagePhysicalGreaterThanTen <= 49.99) {
                    $('#physical-Note, #physical-NoteSucces').text("للمعالجة");
                } else {
                    $('#physical-Note, #physical-NoteSucces').text("-");
                }
                if (percentageInformaticsGreaterThanTen >= 50) {
                    $('#informatics-Note, #informatics-NoteSucces').text("مقبول");
                } else if (percentageInformaticsGreaterThanTen > 1 && percentageInformaticsGreaterThanTen <= 49.99) {
                    $('#informatics-Note, #informatics-NoteSucces').text("للمعالجة");
                } else {
                    $('#informatics-Note, #informatics-NoteSucces').text("-");
                }
                if (percentageFineGreaterThanTen >= 50) {
                    $('#fine-Note, #fine-NoteSucces').text("مقبول");
                } else if (percentageFineGreaterThanTen > 1 && percentageFineGreaterThanTen <= 49.99) {
                    $('#fine-Note, #fine-NoteSucces').text("للمعالجة");
                } else {
                    $('#fine-Note, #fine-NoteSucces').text("-");
                }
                if (percentageMusicGreaterThanTen >= 50) {
                    $('#music-Note, #music-NoteSucces').text("مقبول");
                } else if (percentageMusicGreaterThanTen > 1 && percentageMusicGreaterThanTen <= 49.99) {
                    $('#music-Note, #music-NoteSucces').text("للمعالجة");
                } else {
                    $('#music-Note, #music-NoteSucces').text("-");
                }
                if (percentageAthleticGreaterThanTen >= 50) {
                    $('#athletic-Note, #athletic-NoteSucces').text("مقبول");
                } else if (percentageAthleticGreaterThanTen > 1 && percentageAthleticGreaterThanTen <= 49.99) {
                    $('#athletic-Note, #athletic-NoteSucces').text("للمعالجة");
                } else {
                    $('#athletic-Note, #athletic-NoteSucces').text("-");
                }
                if (percentageRateGreaterThanTen >= 50) {
                    $('#rate-Note, #rate-NoteSucces').text("مقبول");
                } else if (percentageRateGreaterThanTen > 1 && percentageRateGreaterThanTen <= 49.99) {
                    $('#rate-Note, #rate-NoteSucces').text("للمعالجة");
                } else {
                    $('#rate-Note, #rate-NoteSucces').text("-");
                }

                // Update the content of the HTML elements with the counts and percentages
                $('#arabic-countGTen, #arabic-countGTenSucces, #arabic-countGTenDiff').text(countarabicGreaterThanTen);
                $('#amazigh-countGTen, #amazigh-countGTenSucces, #amazigh-countGTenDiff').text(countamazighGreaterThanTen);
                $('#french-countGTen, #french-countGTenSucces, #french-countGTenDiff').text(countfrenchGreaterThanTen);
                $('#english-countGTen, #english-countGTenSucces, #english-countGTenDiff').text(countenglishGreaterThanTen);
                $('#islamic-countGTen, #islamic-countGTenSucces, #islamic-countGTenDiff').text(countislamicGreaterThanTen);
                $('#civics-countGTen, #civics-countGTenSucces, #civics-countGTenDiff').text(countcivicsGreaterThanTen);
                $('#historyandgeography-countGTen, #historyandgeography-countGTenSucces, #historyandgeography-countGTenDiff').text(counthistoryandgeographyGreaterThanTen);
                $('#math-countGTen, #math-countGTenSucces, #math-countGTenDiff').text(countmathGreaterThanTen);
                $('#nature-countGTen, #nature-countGTenSucces, #nature-countGTenDiff').text(countnatureGreaterThanTen);
                $('#physical-countGTen, #physical-countGTenSucces, #physical-countGTenDiff').text(countphysicalGreaterThanTen);
                $('#informatics-countGTen, #informatics-countGTenSucces, #informatics-countGTenDiff').text(countinformaticsGreaterThanTen);
                $('#fine-countGTen, #fine-countGTenSucces, #fine-countGTenDiff').text(countfineGreaterThanTen);
                $('#music-countGTen, #music-countGTenSucces, #music-countGTenDiff').text(countmusicGreaterThanTen);
                $('#athletic-countGTen, #athletic-countGTenSucces, #athletic-countGTenDiff').text(countathleticGreaterThanTen);
                $('#rate-countGTen, #rate-countGTenSucces, #rate-countGTenDiff').text(countrateGreaterThanTen);

                // Update the content of the HTML elements with the counts and percentages
                $('#arabic-percentageGTen, #arabic-percentageGTenSucces, #arabic-percentageGTenDiff').text(percentageArabicGreaterThanTen.toFixed(2) + "%");
                $('#amazigh-percentageGTen, #amazigh-percentageGTenSucces, #amazigh-percentageGTenDiff').text(percentageAmazighGreaterThanTen.toFixed(2) + "%");
                $('#french-percentageGTen, #french-percentageGTenSucces, #french-percentageGTenDiff').text(percentageFrenchGreaterThanTen.toFixed(2) + "%");
                $('#english-percentageGTen, #english-percentageGTenSucces, #english-percentageGTenDiff').text(percentageEnglishGreaterThanTen.toFixed(2) + "%");
                $('#islamic-percentageGTen, #islamic-percentageGTenSucces, #islamic-percentageGTenDiff').text(percentageIslamicGreaterThanTen.toFixed(2) + "%");
                $('#civics-percentageGTen, #civics-percentageGTenSucces, #civics-percentageGTenDiff').text(percentageCivicsGreaterThanTen.toFixed(2) + "%");
                $('#historyandgeography-percentageGTen, #historyandgeography-percentageGTenSucces, #historyandgeography-percentageGTenDiff').text(percentageHistoryAndGeographyGreaterThanTen.toFixed(2) + "%");
                $('#math-percentageGTen, #math-percentageGTenSucces, #math-percentageGTenDiff').text(percentageMathGreaterThanTen.toFixed(2) + "%");
                $('#nature-percentageGTen, #nature-percentageGTenSucces, #nature-percentageGTenDiff').text(percentageNatureGreaterThanTen.toFixed(2) + "%");
                $('#physical-percentageGTen, #physical-percentageGTenSucces, #physical-percentageGTenDiff').text(percentagePhysicalGreaterThanTen.toFixed(2) + "%");
                $('#informatics-percentageGTen, #informatics-percentageGTenSucces, #informatics-percentageGTenDiff').text(percentageInformaticsGreaterThanTen.toFixed(2) + "%");
                $('#fine-percentageGTen, #fine-percentageGTenSucces, #fine-percentageGTenDiff').text(percentageFineGreaterThanTen.toFixed(2) + "%");
                $('#music-percentageGTen, #music-percentageGTenSucces, #music-percentageGTenDiff').text(percentageMusicGreaterThanTen.toFixed(2) + "%");
                $('#athletic-percentageGTen, #athletic-percentageGTenSucces, #athletic-percentageGTenDiff').text(percentageAthleticGreaterThanTen.toFixed(2) + "%");
                $('#rate-percentageGTen, #rate-percentageGTenSucces, #rate-percentageGTenDiff').text(percentageRateGreaterThanTen.toFixed(2) + "%");

                // Add badge dynamically based on mean value
                addBadgepercentageGTen('#arabic-percentageGTen, #arabic-percentageGTenSucces', percentageArabicGreaterThanTen);
                addBadgepercentageGTen('#amazigh-percentageGTen, #amazigh-percentageGTenSucces', percentageAmazighGreaterThanTen);
                addBadgepercentageGTen('#french-percentageGTen, #french-percentageGTenSucces', percentageFrenchGreaterThanTen);
                addBadgepercentageGTen('#english-percentageGTen, #english-percentageGTenSucces', percentageEnglishGreaterThanTen);
                addBadgepercentageGTen('#islamic-percentageGTen, #islamic-percentageGTenSucces', percentageIslamicGreaterThanTen);
                addBadgepercentageGTen('#civics-percentageGTen, #civics-percentageGTenSucces', percentageCivicsGreaterThanTen);
                addBadgepercentageGTen('#historyandgeography-percentageGTen, #historyandgeography-percentageGTenSucces', percentageHistoryAndGeographyGreaterThanTen);
                addBadgepercentageGTen('#math-percentageGTen, #math-percentageGTenSucces', percentageMathGreaterThanTen);
                addBadgepercentageGTen('#nature-percentageGTen, #nature-percentageGTenSucces', percentageNatureGreaterThanTen);
                addBadgepercentageGTen('#physical-percentageGTen, #physical-percentageGTenSucces', percentagePhysicalGreaterThanTen);
                addBadgepercentageGTen('#informatics-percentageGTen, #informatics-percentageGTenSucces', percentageInformaticsGreaterThanTen);
                addBadgepercentageGTen('#fine-percentageGTen, #fine-percentageGTenSucces', percentageFineGreaterThanTen);
                addBadgepercentageGTen('#music-percentageGTen, #music-percentageGTenSucces', percentageMusicGreaterThanTen);
                addBadgepercentageGTen('#athletic-percentageGTen, #athletic-percentageGTenSucces', percentageAthleticGreaterThanTen);
                addBadgepercentageGTen('#rate-percentageGTen, #rate-percentageGTenSucces', percentageRateGreaterThanTen);

                function addBadgepercentageGTen(selectorpercentageGTen, percentageGTen) {
                    if (percentageGTen >1 && percentageGTen < 50) {
                        $(selectorpercentageGTen).append('<span class="badge-1" title="تحصل التلاميذ على معدل أو نسبة تقل عن المتوسط">ضعيف</span>');
                    }
                }

                // Count the number of values greater than 1 in 'اللغة العربية' and 'اللغة اﻷمازيغية'
            let countarabicBetweenEightAndNine = 0;
            let countamazighBetweenEightAndNine = 0;
            let countfrenchBetweenEightAndNine = 0;
            let countenglishBetweenEightAndNine = 0;
            let countislamicBetweenEightAndNine = 0;
            let countcivicsBetweenEightAndNine = 0;
            let counthistoryandgeographyBetweenEightAndNine = 0;
            let countmathBetweenEightAndNine = 0;
            let countnatureBetweenEightAndNine = 0;
            let countphysicalBetweenEightAndNine = 0;
            let countinformaticsBetweenEightAndNine = 0;
            let countfineBetweenEightAndNine = 0;
            let countmusicBetweenEightAndNine = 0;
            let countathleticBetweenEightAndNine = 0;
            let countrateBetweenEightAndNine = 0;

            table.rows().every(function() {
                const rowData = this.data();

                // Calculate the total number of rows
                const totalRows = table.rows().count();

                const arabicValue = parseFloat(rowData['اللغة العربية ف 2']) || 0;
                const amazighValue = parseFloat(rowData['اللغة اﻷمازيغية ف 2']) || 0;
                const frenchValue = parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
                const englishValue = parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
                const islamicValue = parseFloat(rowData['التربية الإسلامية ف 2']) || 0;
                const civicsValue = parseFloat(rowData['التربية المدنية ف 2']) || 0;
                const historyandgeographyValue = parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
                const mathValue = parseFloat(rowData['الرياضيات ف 2']) || 0;
                const natureValue = parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
                const physicalValue = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                const informaticsValue = parseFloat(rowData['المعلوماتية ف 2']) || 0;
                const fineValue = parseFloat(rowData['التربية التشكيلية ف 2']) || 0;
                const musicValue = parseFloat(rowData['التربية الموسيقية ف 2']) || 0;
                const athleticValue = parseFloat(rowData['ت البدنية و الرياضية ف 2']) || 0;
                const rateValue = parseFloat(rowData['معدل الفصل 2']) || 0;

                if (arabicValue >= 8 && arabicValue <= 9.99) {
                    countarabicBetweenEightAndNine++;
                }
                if (amazighValue >= 8 && amazighValue <= 9.99) {
                    countamazighBetweenEightAndNine++;
                }
                if (frenchValue >= 8 && frenchValue <= 9.99) {
                    countfrenchBetweenEightAndNine++;
                }
                if (englishValue >= 8 && englishValue <= 9.99) {
                    countenglishBetweenEightAndNine++;
                }
                if (islamicValue >= 8 && islamicValue <= 9.99) {
                    countislamicBetweenEightAndNine++;
                }
                if (civicsValue >= 8 && civicsValue <= 9.99) {
                    countcivicsBetweenEightAndNine++;
                }
                if (historyandgeographyValue >= 8 && historyandgeographyValue <= 9.99) {
                    counthistoryandgeographyBetweenEightAndNine++;
                }
                if (mathValue >= 8 && mathValue <= 9.99) {
                    countmathBetweenEightAndNine++;
                }
                if (natureValue >= 8 && natureValue <= 9.99) {
                    countnatureBetweenEightAndNine++;
                }
                if (physicalValue >= 8 && physicalValue <= 9.99) {
                    countphysicalBetweenEightAndNine++;
                }
                if (informaticsValue >= 8 && informaticsValue <= 9.99) {
                    countinformaticsBetweenEightAndNine++;
                }
                if (fineValue >= 8 && fineValue <= 9.99) {
                    countfineBetweenEightAndNine++;
                }
                if (musicValue >= 8 && musicValue <= 9.99) {
                    countmusicBetweenEightAndNine++;
                }
                if (athleticValue >= 8 && athleticValue <= 9.99) {
                    countathleticBetweenEightAndNine++;
                }
                if (rateValue >= 8 && rateValue <= 9.99) {
                    countrateBetweenEightAndNine++;
                }        

                return true;


            });

                // Calculate the percentage of values greater than or equal to 10 for each subject
                const percentageArabicBetweenEightAndNine = (countarabicBetweenEightAndNine / totalRows) * 100;
                const percentageAmazighBetweenEightAndNine = (countamazighBetweenEightAndNine / totalRows) * 100;
                const percentageFrenchBetweenEightAndNine = (countfrenchBetweenEightAndNine / totalRows) * 100;
                const percentageEnglishBetweenEightAndNine = (countenglishBetweenEightAndNine / totalRows) * 100;
                const percentageIslamicBetweenEightAndNine = (countislamicBetweenEightAndNine / totalRows) * 100;
                const percentageCivicsBetweenEightAndNine = (countcivicsBetweenEightAndNine / totalRows) * 100;
                const percentageHistoryAndGeographyBetweenEightAndNine = (counthistoryandgeographyBetweenEightAndNine / totalRows) * 100;
                const percentageMathBetweenEightAndNine = (countmathBetweenEightAndNine / totalRows) * 100;
                const percentageNatureBetweenEightAndNine = (countnatureBetweenEightAndNine / totalRows) * 100;
                const percentagePhysicalBetweenEightAndNine = (countphysicalBetweenEightAndNine / totalRows) * 100;
                const percentageInformaticsBetweenEightAndNine = (countinformaticsBetweenEightAndNine / totalRows) * 100;
                const percentageFineBetweenEightAndNine = (countfineBetweenEightAndNine / totalRows) * 100;
                const percentageMusicBetweenEightAndNine = (countmusicBetweenEightAndNine / totalRows) * 100;
                const percentageAthleticBetweenEightAndNine = (countathleticBetweenEightAndNine / totalRows) * 100;
                const percentageRateBetweenEightAndNine = (countrateBetweenEightAndNine / totalRows) * 100;

                // Update the content of the HTML elements with the counts and percentages
                $('#arabic-countBEightAndNine').text(countarabicBetweenEightAndNine);
                $('#amazigh-countBEightAndNine').text(countamazighBetweenEightAndNine);
                $('#french-countBEightAndNine').text(countfrenchBetweenEightAndNine);
                $('#english-countBEightAndNine').text(countenglishBetweenEightAndNine);
                $('#islamic-countBEightAndNine').text(countislamicBetweenEightAndNine);
                $('#civics-countBEightAndNine').text(countcivicsBetweenEightAndNine);
                $('#historyandgeography-countBEightAndNine').text(counthistoryandgeographyBetweenEightAndNine);
                $('#math-countBEightAndNine').text(countmathBetweenEightAndNine);
                $('#nature-countBEightAndNine').text(countnatureBetweenEightAndNine);
                $('#physical-countBEightAndNine').text(countphysicalBetweenEightAndNine);
                $('#informatics-countBEightAndNine').text(countinformaticsBetweenEightAndNine);
                $('#fine-countBEightAndNine').text(countfineBetweenEightAndNine);
                $('#music-countBEightAndNine').text(countmusicBetweenEightAndNine);
                $('#athletic-countBEightAndNine').text(countathleticBetweenEightAndNine);
                $('#rate-countBEightAndNine').text(countrateBetweenEightAndNine);

                // Update the content of the HTML elements with the counts and percentages
                $('#arabic-percentageBEightAndNine').text(percentageArabicBetweenEightAndNine.toFixed(2) + "%");
                $('#amazigh-percentageBEightAndNine').text(percentageAmazighBetweenEightAndNine.toFixed(2) + "%");
                $('#french-percentageBEightAndNine').text(percentageFrenchBetweenEightAndNine.toFixed(2) + "%");
                $('#english-percentageBEightAndNine').text(percentageEnglishBetweenEightAndNine.toFixed(2) + "%");
                $('#islamic-percentageBEightAndNine').text(percentageIslamicBetweenEightAndNine.toFixed(2) + "%");
                $('#civics-percentageBEightAndNine').text(percentageCivicsBetweenEightAndNine.toFixed(2) + "%");
                $('#historyandgeography-percentageBEightAndNine').text(percentageHistoryAndGeographyBetweenEightAndNine.toFixed(2) + "%");
                $('#math-percentageBEightAndNine').text(percentageMathBetweenEightAndNine.toFixed(2) + "%");
                $('#nature-percentageBEightAndNine').text(percentageNatureBetweenEightAndNine.toFixed(2) + "%");
                $('#physical-percentageBEightAndNine').text(percentagePhysicalBetweenEightAndNine.toFixed(2) + "%");
                $('#informatics-percentageBEightAndNine').text(percentageInformaticsBetweenEightAndNine.toFixed(2) + "%");
                $('#fine-percentageBEightAndNine').text(percentageFineBetweenEightAndNine.toFixed(2) + "%");
                $('#music-percentageBEightAndNine').text(percentageMusicBetweenEightAndNine.toFixed(2) + "%");
                $('#athletic-percentageBEightAndNine').text(percentageAthleticBetweenEightAndNine.toFixed(2) + "%");
                $('#rate-percentageBEightAndNine').text(percentageRateBetweenEightAndNine.toFixed(2) + "%");

            // Count the number of values greater than 1 in 'اللغة العربية' and 'اللغة اﻷمازيغية'
            let countarabicLessThanEight = 0;
            let countamazighLessThanEight = 0;
            let countfrenchLessThanEight = 0;
            let countenglishLessThanEight = 0;
            let countislamicLessThanEight = 0;
            let countcivicsLessThanEight = 0;
            let counthistoryandgeographyLessThanEight = 0;
            let countmathLessThanEight = 0;
            let countnatureLessThanEight = 0;
            let countphysicalLessThanEight = 0;
            let countinformaticsLessThanEight = 0;
            let countfineLessThanEight = 0;
            let countmusicLessThanEight = 0;
            let countathleticLessThanEight = 0;
            let countrateLessThanEight = 0;

            table.rows().every(function() {
                const rowData = this.data();

                // Calculate the total number of rows
                const totalRows = table.rows().count();

                const arabicValue = parseFloat(rowData['اللغة العربية ف 2']) || 0;
                const amazighValue = parseFloat(rowData['اللغة اﻷمازيغية ف 2']) || 0;
                const frenchValue = parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
                const englishValue = parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
                const islamicValue = parseFloat(rowData['التربية الإسلامية ف 2']) || 0;
                const civicsValue = parseFloat(rowData['التربية المدنية ف 2']) || 0;
                const historyandgeographyValue = parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
                const mathValue = parseFloat(rowData['الرياضيات ف 2']) || 0;
                const natureValue = parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
                const physicalValue = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                const informaticsValue = parseFloat(rowData['المعلوماتية ف 2']) || 0;
                const fineValue = parseFloat(rowData['التربية التشكيلية ف 2']) || 0;
                const musicValue = parseFloat(rowData['التربية الموسيقية ف 2']) || 0;
                const athleticValue = parseFloat(rowData['ت البدنية و الرياضية ف 2']) || 0;
                const rateValue = parseFloat(rowData['معدل الفصل 2']) || 0;

                if (arabicValue >0 && arabicValue < 8) {
                    countarabicLessThanEight++;
                }
                if (amazighValue >0 && amazighValue < 8) {
                    countamazighLessThanEight++;
                }
                if (frenchValue >0 && frenchValue < 8) {
                    countfrenchLessThanEight++;
                }
                if (englishValue >0 && englishValue < 8) {
                    countenglishLessThanEight++;
                }
                if (islamicValue >0 && islamicValue < 8) {
                    countislamicLessThanEight++;
                }
                if (civicsValue >0 && civicsValue < 8) {
                    countcivicsLessThanEight++;
                }
                if (historyandgeographyValue >0 && historyandgeographyValue < 8) {
                    counthistoryandgeographyLessThanEight++;
                }
                if (mathValue >0 && mathValue < 8) {
                    countmathLessThanEight++;
                }
                if (natureValue >0 && natureValue < 8) {
                    countnatureLessThanEight++;
                }
                if (physicalValue >0 && physicalValue < 8) {
                    countphysicalLessThanEight++;
                }
                if (informaticsValue >0 && informaticsValue < 8) {
                    countinformaticsLessThanEight++;
                }
                if (fineValue >0 && fineValue < 8) {
                    countfineLessThanEight++;
                }
                if (musicValue >0 && musicValue < 8) {
                    countmusicLessThanEight++;
                }
                if (athleticValue >0 && athleticValue < 8) {
                    countathleticLessThanEight++;
                }
                if (rateValue >0 && rateValue < 8) {
                    countrateLessThanEight++;
                }        

                return true;

            });

                // Calculate the percentage of values greater than or equal to 10 for each subject
                const percentageArabicLessThanEight = (countarabicLessThanEight / totalRows) * 100;
                const percentageAmazighLessThanEight = (countamazighLessThanEight / totalRows) * 100;
                const percentageFrenchLessThanEight = (countfrenchLessThanEight / totalRows) * 100;
                const percentageEnglishLessThanEight = (countenglishLessThanEight / totalRows) * 100;
                const percentageIslamicLessThanEight = (countislamicLessThanEight / totalRows) * 100;
                const percentageCivicsLessThanEight = (countcivicsLessThanEight / totalRows) * 100;
                const percentageHistoryAndGeographyLessThanEight = (counthistoryandgeographyLessThanEight / totalRows) * 100;
                const percentageMathLessThanEight = (countmathLessThanEight / totalRows) * 100;
                const percentageNatureLessThanEight = (countnatureLessThanEight / totalRows) * 100;
                const percentagePhysicalLessThanEight = (countphysicalLessThanEight / totalRows) * 100;
                const percentageInformaticsLessThanEight = (countinformaticsLessThanEight / totalRows) * 100;
                const percentageFineLessThanEight = (countfineLessThanEight / totalRows) * 100;
                const percentageMusicLessThanEight = (countmusicLessThanEight / totalRows) * 100;
                const percentageAthleticLessThanEight = (countathleticLessThanEight / totalRows) * 100;
                const percentageRateLessThanEight = (countrateLessThanEight / totalRows) * 100;

                // Update the content of the HTML elements with the counts and percentages
                $('#arabic-countLEight').text(countarabicLessThanEight);
                $('#amazigh-countLEight').text(countamazighLessThanEight);
                $('#french-countLEight').text(countfrenchLessThanEight);
                $('#english-countLEight').text(countenglishLessThanEight);
                $('#islamic-countLEight').text(countislamicLessThanEight);
                $('#civics-countLEight').text(countcivicsLessThanEight);
                $('#historyandgeography-countLEight').text(counthistoryandgeographyLessThanEight);
                $('#math-countLEight').text(countmathLessThanEight);
                $('#nature-countLEight').text(countnatureLessThanEight);
                $('#physical-countLEight').text(countphysicalLessThanEight);
                $('#informatics-countLEight').text(countinformaticsLessThanEight);
                $('#fine-countLEight').text(countfineLessThanEight);
                $('#music-countLEight').text(countmusicLessThanEight);
                $('#athletic-countLEight').text(countathleticLessThanEight);
                $('#rate-countLEight').text(countrateLessThanEight);

                // Update the content of the HTML elements with the counts and percentages
                $('#arabic-percentageLEight').text(percentageArabicLessThanEight.toFixed(2) + "%");
                $('#amazigh-percentageLEight').text(percentageAmazighLessThanEight.toFixed(2) + "%");
                $('#french-percentageLEight').text(percentageFrenchLessThanEight.toFixed(2) + "%");
                $('#english-percentageLEight').text(percentageEnglishLessThanEight.toFixed(2) + "%");
                $('#islamic-percentageLEight').text(percentageIslamicLessThanEight.toFixed(2) + "%");
                $('#civics-percentageLEight').text(percentageCivicsLessThanEight.toFixed(2) + "%");
                $('#historyandgeography-percentageLEight').text(percentageHistoryAndGeographyLessThanEight.toFixed(2) + "%");
                $('#math-percentageLEight').text(percentageMathLessThanEight.toFixed(2) + "%");
                $('#nature-percentageLEight').text(percentageNatureLessThanEight.toFixed(2) + "%");
                $('#physical-percentageLEight').text(percentagePhysicalLessThanEight.toFixed(2) + "%");
                $('#informatics-percentageLEight').text(percentageInformaticsLessThanEight.toFixed(2) + "%");
                $('#fine-percentageLEight').text(percentageFineLessThanEight.toFixed(2) + "%");
                $('#music-percentageLEight').text(percentageMusicLessThanEight.toFixed(2) + "%");
                $('#athletic-percentageLEight').text(percentageAthleticLessThanEight.toFixed(2) + "%");
                $('#rate-percentageLEight').text(percentageRateLessThanEight.toFixed(2) + "%");

                // Gender DataTable
                // Calculate Gender DataTable for Male
                // Initialize counters for each subject
                let countarabicMale = 0;
                let countamazighMale = 0;
                let countfrenchMale = 0;
                let countenglishMale = 0;
                let countislamicMale = 0;
                let countcivicsMale = 0;
                let counthistoryandgeographyMale = 0;
                let countmathMale = 0;
                let countnatureMale = 0;
                let countphysicalMale = 0;
                let countinformaticsMale = 0;
                let countfineMale = 0;
                let countmusicMale = 0;
                let countathleticMale = 0;
                let countrateMale = 0;

                // Iterate over each row in the table
                table.rows().every(function() {
                    const rowData = this.data();

                    // Check each subject for values greater than or equal to 1
                    const gender = rowData['الجنس'];
                    const arabicValue = parseFloat(rowData['اللغة العربية ف 2']) || 0;
                    const amazighValue = parseFloat(rowData['اللغة اﻷمازيغية ف 2']) || 0;
                    const frenchValue = parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
                    const englishValue = parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
                    const islamicValue = parseFloat(rowData['التربية الإسلامية ف 2']) || 0;
                    const civicsValue = parseFloat(rowData['التربية المدنية ف 2']) || 0;
                    const historyandgeographyValue = parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
                    const mathValue = parseFloat(rowData['الرياضيات ف 2']) || 0;
                    const natureValue = parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
                    const physicalValue = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                    const informaticsValue = parseFloat(rowData['المعلوماتية ف 2']) || 0;
                    const fineValue = parseFloat(rowData['التربية التشكيلية ف 2']) || 0;
                    const musicValue = parseFloat(rowData['التربية الموسيقية ف 2']) || 0;
                    const athleticValue = parseFloat(rowData['ت البدنية و الرياضية ف 2']) || 0;
                    const rateValue = parseFloat(rowData['معدل الفصل 2']) || 0;

                   
                    if (gender === "ذكر" && arabicValue >= 1) {
                        countarabicMale++;
                    }
                    if (gender === "ذكر" && amazighValue >= 1) {
                        countamazighMale++;
                    }
                    if (gender === "ذكر" && frenchValue >= 1) {
                        countfrenchMale++;
                    }
                    if (gender === "ذكر" && englishValue >= 1) {
                        countenglishMale++;
                    }
                    if (gender === "ذكر" && islamicValue >= 1) {
                        countislamicMale++;
                    }
                    if (gender === "ذكر" && civicsValue >= 1) {
                        countcivicsMale++;
                    }
                    if (gender === "ذكر" && historyandgeographyValue >= 1) {
                        counthistoryandgeographyMale++;
                    }
                    if (gender === "ذكر" && mathValue >= 1) {
                        countmathMale++;
                    }
                    if (gender === "ذكر" && natureValue >= 1) {
                        countnatureMale++;
                    }
                    if (gender === "ذكر" && physicalValue >= 1) {
                        countphysicalMale++;
                    }
                    if (gender === "ذكر" && informaticsValue >= 1) {
                        countinformaticsMale++;
                    }
                    if (gender === "ذكر" && fineValue >= 1) {
                        countfineMale++;
                    }
                    if (gender === "ذكر" && musicValue >= 1) {
                        countmusicMale++;
                    }
                    if (gender === "ذكر" && athleticValue >= 1) {
                        countathleticMale++;
                    }
                    if (gender === "ذكر" && rateValue >= 1) {
                        countrateMale++;
                    }

                    // Continue iteration over rows
                    return true;
                });

                // Update the HTML elements with the counts for each subject
                $('#arabic-countMale').text(countarabicMale);
                $('#amazigh-countMale').text(countamazighMale);
                $('#french-countMale').text(countfrenchMale);
                $('#english-countMale').text(countenglishMale);
                $('#islamic-countMale').text(countislamicMale);
                $('#civics-countMale').text(countcivicsMale);
                $('#historyandgeography-countMale').text(counthistoryandgeographyMale);
                $('#math-countMale').text(countmathMale);
                $('#nature-countMale').text(countnatureMale);
                $('#physical-countMale').text(countphysicalMale);
                $('#informatics-countMale').text(countinformaticsMale);
                $('#fine-countMale').text(countfineMale);
                $('#music-countMale').text(countmusicMale);
                $('#athletic-countMale').text(countathleticMale);
                $('#rate-countMale').text(countrateMale);


                // Initialize variables for sum and count
                let sumArabicMale = 0;
                let sumAmazighMale = 0;
                let sumFrenchMale = 0;
                let sumEnglishMale = 0;
                let sumIslamicMale = 0;
                let sumCivicsMale = 0;
                let sumHistoryGeographyMale = 0;
                let sumMathMale = 0;
                let sumNatureMale = 0;
                let sumPhysicalMale = 0;
                let sumInformaticsMale = 0;
                let sumFineMale = 0;
                let sumMusicMale = 0;
                let sumAthleticMale = 0;
                let sumRateMale = 0;

                let countArabicMale = 0;
                let countAmazighMale = 0;
                let countFrenchMale = 0;
                let countEnglishMale = 0;
                let countIslamicMale = 0;
                let countCivicsMale = 0;
                let countHistoryGeographyMale = 0;
                let countMathMale = 0;
                let countNatureMale = 0;
                let countPhysicalMale = 0;
                let countInformaticsMale = 0;
                let countFineMale = 0;
                let countMusicMale = 0;
                let countAthleticMale = 0;
                let countRateMale = 0;

                let countArabicGTenMale = 0;
                let countAmazighGTenMale = 0;
                let countFrenchGTenMale = 0;
                let countEnglishGTenMale = 0;
                let countIslamicGTenMale = 0;
                let countCivicsGTenMale = 0;
                let countHistoryGeographyGTenMale = 0;
                let countMathGTenMale = 0;
                let countNatureGTenMale = 0;
                let countPhysicalGTenMale = 0;
                let countInformaticsGTenMale = 0;
                let countFineGTenMale = 0;
                let countMusicGTenMale = 0;
                let countAthleticGTenMale = 0;
                let countRateGTenMale = 0;

                let countArabicBetweenEightAndNineMale = 0;
                let countAmazighBetweenEightAndNineMale = 0;
                let countFrenchBetweenEightAndNineMale = 0;
                let countEnglishBetweenEightAndNineMale = 0;
                let countIslamicBetweenEightAndNineMale = 0;
                let countCivicsBetweenEightAndNineMale = 0;
                let countHistoryGeographyBetweenEightAndNineMale = 0;
                let countMathBetweenEightAndNineMale = 0;
                let countNatureBetweenEightAndNineMale = 0;
                let countPhysicalBetweenEightAndNineMale = 0;
                let countInformaticsBetweenEightAndNineMale = 0;
                let countFineBetweenEightAndNineMale = 0;
                let countMusicBetweenEightAndNineMale = 0;
                let countAthleticBetweenEightAndNineMale = 0;
                let countRateBetweenEightAndNineMale = 0;

                let countArabicLessThanEightMale = 0;
                let countAmazighLessThanEightMale = 0;
                let countFrenchLessThanEightMale = 0;
                let countEnglishLessThanEightMale = 0;
                let countIslamicLessThanEightMale = 0;
                let countCivicsLessThanEightMale = 0;
                let countHistoryGeographyLessThanEightMale = 0;
                let countMathLessThanEightMale = 0;
                let countNatureLessThanEightMale = 0;
                let countPhysicalLessThanEightMale = 0;
                let countInformaticsLessThanEightMale = 0;
                let countFineLessThanEightMale = 0;
                let countMusicLessThanEightMale = 0;
                let countAthleticLessThanEightMale = 0;
                let countRateLessThanEightMale= 0;

                // Iterate over each row in the table
                table.rows().every(function () {
                    const rowData = this.data();

                    const gender = rowData['الجنس'];

                    const arabicValue = parseFloat(rowData['اللغة العربية ف 2']) || 0;
                    const amazighValue = parseFloat(rowData['اللغة اﻷمازيغية ف 2']) || 0;
                    const frenchValue = parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
                    const englishValue = parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
                    const islamicValue = parseFloat(rowData['التربية الإسلامية ف 2']) || 0;
                    const civicsValue = parseFloat(rowData['التربية المدنية ف 2']) || 0;
                    const historyGeographyValue = parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
                    const mathValue = parseFloat(rowData['الرياضيات ف 2']) || 0;
                    const natureValue = parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
                    const physicalValue = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                    const informaticsValue = parseFloat(rowData['المعلوماتية ف 2']) || 0;
                    const fineValue = parseFloat(rowData['التربية التشكيلية ف 2']) || 0;
                    const musicValue = parseFloat(rowData['التربية الموسيقية ف 2']) || 0;
                    const athleticValue = parseFloat(rowData['ت البدنية و الرياضية ف 2']) || 0;
                    const rateValue = parseFloat(rowData['معدل الفصل 2']) || 0;

                    if (gender === "ذكر" && arabicValue >= 1) {
                        sumArabicMale += arabicValue;
                        countArabicMale++;
                    }
                    if (gender === "ذكر" && amazighValue >= 1) {
                        sumAmazighMale += amazighValue;
                        countAmazighMale++;
                    }
                    if (gender === "ذكر" && frenchValue >= 1) {
                        sumFrenchMale += frenchValue;
                        countFrenchMale++;
                    }
                    if (gender === "ذكر" && englishValue >= 1) {
                        sumEnglishMale += englishValue;
                        countEnglishMale++;
                    }
                    if (gender === "ذكر" && islamicValue >= 1) {
                        sumIslamicMale += islamicValue;
                        countIslamicMale++;
                    }
                    if (gender === "ذكر" && civicsValue >= 1) {
                        sumCivicsMale += civicsValue;
                        countCivicsMale++;
                    }
                    if (gender === "ذكر" && historyGeographyValue >= 1) {
                        sumHistoryGeographyMale += historyGeographyValue;
                        countHistoryGeographyMale++;
                    }
                    if (gender === "ذكر" && mathValue >= 1) {
                        sumMathMale += mathValue;
                        countMathMale++;
                    }
                    if (gender === "ذكر" && natureValue >= 1) {
                        sumNatureMale += natureValue;
                        countNatureMale++;
                    }
                    if (gender === "ذكر" && physicalValue >= 1) {
                        sumPhysicalMale += physicalValue;
                        countPhysicalMale++;
                    }
                    if (gender === "ذكر" && informaticsValue >= 1) {
                        sumInformaticsMale += informaticsValue;
                        countInformaticsMale++;
                    }
                    if (gender === "ذكر" && fineValue >= 1) {
                        sumFineMale += fineValue;
                        countFineMale++;
                    }
                    if (gender === "ذكر" && musicValue >= 1) {
                        sumMusicMale += musicValue;
                        countMusicMale++;
                    }
                    if (gender === "ذكر" && athleticValue >= 1) {
                        sumAthleticMale += athleticValue;
                        countAthleticMale++;
                    }
                    if (gender === "ذكر" && rateValue >= 1) {
                        sumRateMale += rateValue;
                        countRateMale++;
                    }

                    // Greater than ten
                    if (gender === "ذكر" && arabicValue >= 10) {
                        countArabicGTenMale++;
                    }
                    if (gender === "ذكر" && amazighValue >= 10) {
                        countAmazighGTenMale++;
                    }
                    if (gender === "ذكر" && frenchValue >= 10) {
                        countFrenchGTenMale++;
                    }
                    if (gender === "ذكر" && englishValue >= 10) {
                        countEnglishGTenMale++;
                    }
                    if (gender === "ذكر" && islamicValue >= 10) {
                        countIslamicGTenMale++;
                    }
                    if (gender === "ذكر" && civicsValue >= 10) {
                        countCivicsGTenMale++;
                    }
                    if (gender === "ذكر" && historyGeographyValue >= 10) {
                        countHistoryGeographyGTenMale++;
                    }
                    if (gender === "ذكر" && mathValue >= 10) {
                        countMathGTenMale++;
                    }
                    if (gender === "ذكر" && natureValue >= 10) {
                        countNatureGTenMale++;
                    }
                    if (gender === "ذكر" && physicalValue >= 10) {
                        countPhysicalGTenMale++;
                    }
                    if (gender === "ذكر" && informaticsValue >= 10) {
                        countInformaticsGTenMale++;
                    }
                    if (gender === "ذكر" && fineValue >= 10) {
                        countFineGTenMale++;
                    }
                    if (gender === "ذكر" && musicValue >= 10) {
                        countMusicGTenMale++;
                    }
                    if (gender === "ذكر" && athleticValue >= 10) {
                        countAthleticGTenMale++;
                    }
                    if (gender === "ذكر" && rateValue >= 10) {
                        countRateGTenMale++;
                    }

                    // Greater or Equal 8 and Less or Equal 9.99
                    if (gender === "ذكر" && arabicValue >= 8 && arabicValue <= 9.99) {
                        countArabicBetweenEightAndNineMale++;
                    }
                    if (gender === "ذكر" && amazighValue >= 8 && amazighValue <= 9.99) {
                        countAmazighBetweenEightAndNineMale++;
                    }
                    if (gender === "ذكر" && frenchValue >= 8 && frenchValue <= 9.99) {
                        countFrenchBetweenEightAndNineMale++;
                    }
                    if (gender === "ذكر" && englishValue >= 8 && englishValue <= 9.99) {
                        countEnglishBetweenEightAndNineMale++;
                    }
                    if (gender === "ذكر" && islamicValue >= 8 && islamicValue <= 9.99) {
                        countIslamicBetweenEightAndNineMale++;
                    }
                    if (gender === "ذكر" && civicsValue >= 8 && civicsValue <= 9.99) {
                        countCivicsBetweenEightAndNineMale++;
                    }
                    if (gender === "ذكر" && historyGeographyValue >= 8 && historyGeographyValue <= 9.99) {
                        countHistoryGeographyBetweenEightAndNineMale++;
                    }
                    if (gender === "ذكر" && mathValue >= 8 && mathValue <= 9.99) {
                        countMathBetweenEightAndNineMale++;
                    }
                    if (gender === "ذكر" && natureValue >= 8 && natureValue <= 9.99) {
                        countNatureBetweenEightAndNineMale++;
                    }
                    if (gender === "ذكر" && physicalValue >= 8 && physicalValue <= 9.99) {
                        countPhysicalBetweenEightAndNineMale++;
                    }
                    if (gender === "ذكر" && informaticsValue >= 8 && informaticsValue <= 9.99) {
                        countInformaticsBetweenEightAndNineMale++;
                    }
                    if (gender === "ذكر" && fineValue >= 8 && fineValue <= 9.99) {
                        countFineBetweenEightAndNineMale++;
                    }
                    if (gender === "ذكر" && musicValue >= 8 && musicValue <= 9.99) {
                        countMusicBetweenEightAndNineMale++;
                    }
                    if (gender === "ذكر" && athleticValue >= 8 && athleticValue <= 9.99) {
                        countAthleticBetweenEightAndNineMale++;
                    }
                    if (gender === "ذكر" && rateValue >= 8 && rateValue <= 9.99) {
                        countRateBetweenEightAndNineMale++;
                    }

                    // Greater or Equal 1 and Less or Equal 8
                    if (gender === "ذكر" && arabicValue >= 1 && arabicValue <= 8) {
                        countArabicLessThanEightMale++;
                    }
                    if (gender === "ذكر" && amazighValue >= 1 && amazighValue <= 8) {
                        countAmazighLessThanEightMale++;
                    }
                    if (gender === "ذكر" && frenchValue >= 1 && frenchValue <= 8) {
                        countFrenchLessThanEightMale++;
                    }
                    if (gender === "ذكر" && englishValue >= 1 && englishValue <= 8) {
                        countEnglishLessThanEightMale++;
                    }
                    if (gender === "ذكر" && islamicValue >= 1 && islamicValue <= 8) {
                        countIslamicLessThanEightMale++;
                    }
                    if (gender === "ذكر" && civicsValue >= 1 && civicsValue <= 8) {
                        countCivicsLessThanEightMale++;
                    }
                    if (gender === "ذكر" && historyGeographyValue >= 1 && historyGeographyValue <= 8) {
                        countHistoryGeographyLessThanEightMale++;
                    }
                    if (gender === "ذكر" && mathValue >= 1 && mathValue <= 8) {
                        countMathLessThanEightMale++;
                    }
                    if (gender === "ذكر" && natureValue >= 1 && natureValue <= 8) {
                        countNatureLessThanEightMale++;
                    }
                    if (gender === "ذكر" && physicalValue >= 1 && physicalValue <= 8) {
                        countPhysicalLessThanEightMale++;
                    }
                    if (gender === "ذكر" && informaticsValue >= 1 && informaticsValue <= 8) {
                        countInformaticsLessThanEightMale++;
                    }
                    if (gender === "ذكر" && fineValue >= 1 && fineValue <= 8) {
                        countFineLessThanEightMale++;
                    }
                    if (gender === "ذكر" && musicValue >= 1 && musicValue <= 8) {
                        countMusicLessThanEightMale++;
                    }
                    if (gender === "ذكر" && athleticValue >= 1 && athleticValue <= 8) {
                        countAthleticLessThanEightMale++;
                    }
                    if (gender === "ذكر" && rateValue >= 1 && rateValue <= 8) {
                        countRateLessThanEightMale++;
                    } 
                    // Continue iteration over rows
                    return true;
                });

                // Calculate mean
                const meanArabicMale = countArabicMale > 0 ? sumArabicMale / countArabicMale : 0;
                const meanAmazighMale = countAmazighMale > 0 ? sumAmazighMale / countAmazighMale : 0;
                const meanFrenchMale = countFrenchMale > 0 ? sumFrenchMale / countFrenchMale : 0;
                const meanEnglishMale = countEnglishMale > 0 ? sumEnglishMale / countEnglishMale : 0;
                const meanIslamicMale = countIslamicMale > 0 ? sumIslamicMale / countIslamicMale : 0;
                const meanCivicsMale = countCivicsMale > 0 ? sumCivicsMale / countCivicsMale : 0;
                const meanHistoryGeographyMale = countHistoryGeographyMale > 0 ? sumHistoryGeographyMale / countHistoryGeographyMale : 0;
                const meanMathMale = countMathMale > 0 ? sumMathMale / countMathMale : 0;
                const meanNatureMale = countNatureMale > 0 ? sumNatureMale / countNatureMale : 0;
                const meanPhysicalMale = countPhysicalMale > 0 ? sumPhysicalMale / countPhysicalMale : 0;
                const meanInformaticsMale = countInformaticsMale > 0 ? sumInformaticsMale / countInformaticsMale : 0;
                const meanFineMale = countFineMale > 0 ? sumFineMale / countFineMale : 0;
                const meanMusicMale = countMusicMale > 0 ? sumMusicMale / countMusicMale : 0;
                const meanAthleticMale = countAthleticMale > 0 ? sumAthleticMale / countAthleticMale : 0;
                const meanRateMale = countRateMale > 0 ? sumRateMale / countRateMale : 0;


                // Calculate the percentage of values greater than or equal to 10 for each subject
                const percentageArabicGTenMale = countArabicMale !== 0 ? (countArabicGTenMale / countArabicMale) * 100 : 0;
                const percentageAmazighGTenMale = countAmazighMale !== 0 ? (countAmazighGTenMale / countAmazighMale) * 100 : 0;
                const percentageFrenchGTenMale = countFrenchMale !== 0 ? (countFrenchGTenMale / countFrenchMale) * 100 : 0;
                const percentageEnglishGTenMale = countEnglishMale !== 0 ? (countEnglishGTenMale / countEnglishMale) * 100 : 0;
                const percentageIslamicGTenMale = countIslamicMale !== 0 ? (countIslamicGTenMale / countIslamicMale) * 100 : 0;
                const percentageCivicsGTenMale = countCivicsMale !== 0 ? (countCivicsGTenMale / countCivicsMale) * 100 : 0;
                const percentageHistoryAndGeographyGTenMale = countHistoryGeographyMale !== 0 ? (countHistoryGeographyGTenMale / countHistoryGeographyMale) * 100 : 0;
                const percentageMathGTenMale = countMathMale !== 0 ? (countMathGTenMale / countMathMale) * 100 : 0;
                const percentageNatureGTenMale = countNatureMale !== 0 ? (countNatureGTenMale / countNatureMale) * 100 : 0;
                const percentagePhysicalGTenMale = countPhysicalMale !== 0 ? (countPhysicalGTenMale / countPhysicalMale) * 100 : 0;
                const percentageInformaticsGTenMale = countInformaticsMale !== 0 ? (countInformaticsGTenMale / countInformaticsMale) * 100 : 0;
                const percentageFineGTenMale = countFineMale !== 0 ? (countFineGTenMale / countFineMale) * 100 : 0;
                const percentageMusicGTenMale = countMusicMale !== 0 ? (countMusicGTenMale / countMusicMale) * 100 : 0;
                const percentageAthleticGTenMale = countAthleticMale !== 0 ? (countAthleticGTenMale / countAthleticMale) * 100 : 0;
                const percentageRateGTenMale = countRateMale !== 0 ? (countRateGTenMale / countRateMale) * 100 : 0;

                // Calculate the percentage of values greater than or equal to 8 less than or equal to 9.99 for each subject
                const percentageArabicBetweenEightAndNineMale = countArabicMale !== 0 ? (countArabicBetweenEightAndNineMale / countArabicMale) * 100 : 0;
                const percentageAmazighBetweenEightAndNineMale = countAmazighMale !== 0 ? (countAmazighBetweenEightAndNineMale / countAmazighMale) * 100 : 0;
                const percentageFrenchBetweenEightAndNineMale = countFrenchMale !== 0 ? (countFrenchBetweenEightAndNineMale / countFrenchMale) * 100 : 0;
                const percentageEnglishBetweenEightAndNineMale = countEnglishMale !== 0 ? (countEnglishBetweenEightAndNineMale / countEnglishMale) * 100 : 0;
                const percentageIslamicBetweenEightAndNineMale = countIslamicMale !== 0 ? (countIslamicBetweenEightAndNineMale / countIslamicMale) * 100 : 0;
                const percentageCivicsBetweenEightAndNineMale = countCivicsMale !== 0 ? (countCivicsBetweenEightAndNineMale / countCivicsMale) * 100 : 0;
                const percentageHistoryAndGeographyBetweenEightAndNineMale = countHistoryGeographyMale !== 0 ? (countHistoryGeographyBetweenEightAndNineMale / countHistoryGeographyMale) * 100 : 0;
                const percentageMathBetweenEightAndNineMale = countMathMale !== 0 ? (countMathBetweenEightAndNineMale / countMathMale) * 100 : 0;
                const percentageNatureBetweenEightAndNineMale = countNatureMale !== 0 ? (countNatureBetweenEightAndNineMale / countNatureMale) * 100 : 0;
                const percentagePhysicalBetweenEightAndNineMale = countPhysicalMale !== 0 ? (countPhysicalBetweenEightAndNineMale / countPhysicalMale) * 100 : 0;
                const percentageInformaticsBetweenEightAndNineMale = countInformaticsMale !== 0 ? (countInformaticsBetweenEightAndNineMale / countInformaticsMale) * 100 : 0;
                const percentageFineBetweenEightAndNineMale = countFineMale !== 0 ? (countFineBetweenEightAndNineMale / countFineMale) * 100 : 0;
                const percentageMusicBetweenEightAndNineMale = countMusicMale !== 0 ? (countMusicBetweenEightAndNineMale / countMusicMale) * 100 : 0;
                const percentageAthleticBetweenEightAndNineMale = countAthleticMale !== 0 ? (countAthleticBetweenEightAndNineMale / countAthleticMale) * 100 : 0;
                const percentageRateBetweenEightAndNineMale = countRateMale !== 0 ? (countRateBetweenEightAndNineMale / countRateMale) * 100 : 0;

                // Calculate the percentage of values greater than or equal to 1 less than or equal to 8 for each subject
                const percentageArabicLessThanEightMale = countArabicMale !== 0 ? (countArabicLessThanEightMale / countArabicMale) * 100 : 0;
                const percentageAmazighLessThanEightMale = countAmazighMale !== 0 ? (countAmazighLessThanEightMale / countAmazighMale) * 100 : 0;
                const percentageFrenchLessThanEightMale = countFrenchMale !== 0 ? (countFrenchLessThanEightMale / countFrenchMale) * 100 : 0;
                const percentageEnglishLessThanEightMale = countEnglishMale !== 0 ? (countEnglishLessThanEightMale / countEnglishMale) * 100 : 0;
                const percentageIslamicLessThanEightMale = countIslamicMale !== 0 ? (countIslamicLessThanEightMale / countIslamicMale) * 100 : 0;
                const percentageCivicsLessThanEightMale = countCivicsMale !== 0 ? (countCivicsLessThanEightMale / countCivicsMale) * 100 : 0;
                const percentageHistoryAndGeographyLessThanEightMale = countHistoryGeographyMale !== 0 ? (countHistoryGeographyLessThanEightMale / countHistoryGeographyMale) * 100 : 0;
                const percentageMathLessThanEightMale = countMathMale !== 0 ? (countMathLessThanEightMale / countMathMale) * 100 : 0;
                const percentageNatureLessThanEightMale = countNatureMale !== 0 ? (countNatureLessThanEightMale / countNatureMale) * 100 : 0;
                const percentagePhysicalLessThanEightMale = countPhysicalMale !== 0 ? (countPhysicalLessThanEightMale / countPhysicalMale) * 100 : 0;
                const percentageInformaticsLessThanEightMale = countInformaticsMale !== 0 ? (countInformaticsLessThanEightMale / countInformaticsMale) * 100 : 0;
                const percentageFineLessThanEightMale = countFineMale !== 0 ? (countFineLessThanEightMale / countFineMale) * 100 : 0;
                const percentageMusicLessThanEightMale = countMusicMale !== 0 ? (countMusicLessThanEightMale / countMusicMale) * 100 : 0;
                const percentageAthleticLessThanEightMale = countAthleticMale !== 0 ? (countAthleticLessThanEightMale / countAthleticMale) * 100 : 0;
                const percentageRateLessThanEightMale = countRateMale !== 0 ? (countRateLessThanEightMale / countRateMale) * 100 : 0;
                    
                // Update the HTML elements with the means for each subject
                $('#arabic-meanMale').text(meanArabicMale.toFixed(2));
                $('#amazigh-meanMale').text(meanAmazighMale.toFixed(2));
                $('#french-meanMale').text(meanFrenchMale.toFixed(2));
                $('#english-meanMale').text(meanEnglishMale.toFixed(2));
                $('#islamic-meanMale').text(meanIslamicMale.toFixed(2));
                $('#civics-meanMale').text(meanCivicsMale.toFixed(2));
                $('#historyandgeography-meanMale').text(meanHistoryGeographyMale.toFixed(2));
                $('#math-meanMale').text(meanMathMale.toFixed(2));
                $('#nature-meanMale').text(meanNatureMale.toFixed(2));
                $('#physical-meanMale').text(meanPhysicalMale.toFixed(2));
                $('#informatics-meanMale').text(meanInformaticsMale.toFixed(2));
                $('#fine-meanMale').text(meanFineMale.toFixed(2));
                $('#music-meanMale').text(meanMusicMale.toFixed(2));
                $('#athletic-meanMale').text(meanAthleticMale.toFixed(2));
                $('#rate-meanMale').text(meanRateMale.toFixed(2));

                // Add badge dynamically based on mean value
                addBadgeMale('#arabic-meanMale', meanArabicMale);
                addBadgeMale('#amazigh-meanMale', meanAmazighMale);
                addBadgeMale('#french-meanMale', meanFrenchMale);
                addBadgeMale('#english-meanMale', meanEnglishMale);
                addBadgeMale('#islamic-meanMale', meanIslamicMale);
                addBadgeMale('#civics-meanMale', meanCivicsMale);
                addBadgeMale('#historyandgeography-meanMale', meanHistoryGeographyMale);
                addBadgeMale('#math-meanMale', meanMathMale);
                addBadgeMale('#nature-meanMale', meanNatureMale);
                addBadgeMale('#physical-meanMale', meanPhysicalMale);
                addBadgeMale('#informatics-meanMale', meanInformaticsMale);
                addBadgeMale('#fine-meanMale', meanFineMale);
                addBadgeMale('#music-meanMale', meanMusicMale);
                addBadgeMale('#athletic-meanMale', meanAthleticMale);
                addBadgeMale('#rate-meanMale', meanRateMale);

                function addBadgeMale(selectorMale, Male) {
                    if (Male >=1 && Male < 10) {
                        $(selectorMale).append('<span class="badge-1" title="تحصل التلاميذ على معدل أو نسبة تقل عن المتوسط">ضعيف</span>');
                    }
                }

                // Update the HTML elements with the means for each subject
                $('#arabic-countGTenMale').text(countArabicGTenMale);
                $('#amazigh-countGTenMale').text(countAmazighGTenMale);
                $('#french-countGTenMale').text(countFrenchGTenMale);
                $('#english-countGTenMale').text(countEnglishGTenMale);
                $('#islamic-countGTenMale').text(countIslamicGTenMale);
                $('#civics-countGTenMale').text(countCivicsGTenMale);
                $('#historyandgeography-countGTenMale').text(countHistoryGeographyGTenMale);
                $('#math-countGTenMale').text(countMathGTenMale);
                $('#nature-countGTenMale').text(countNatureGTenMale);
                $('#physical-countGTenMale').text(countPhysicalGTenMale);
                $('#informatics-countGTenMale').text(countInformaticsGTenMale);
                $('#fine-countGTenMale').text(countFineGTenMale);
                $('#music-countGTenMale').text(countMusicGTenMale);
                $('#athletic-countGTenMale').text(countAthleticGTenMale);
                $('#rate-countGTenMale').text(countRateGTenMale);

                // Update the HTML elements with the means for each subject
                $('#arabic-percentageGTenMale').text(percentageArabicGTenMale.toFixed(2) + "%");
                $('#amazigh-percentageGTenMale').text(percentageAmazighGTenMale.toFixed(2) + "%");
                $('#french-percentageGTenMale').text(percentageFrenchGTenMale.toFixed(2) + "%");
                $('#english-percentageGTenMale').text(percentageEnglishGTenMale.toFixed(2) + "%");
                $('#islamic-percentageGTenMale').text(percentageIslamicGTenMale.toFixed(2) + "%");
                $('#civics-percentageGTenMale').text(percentageCivicsGTenMale.toFixed(2) + "%");
                $('#historyandgeography-percentageGTenMale').text(percentageHistoryAndGeographyGTenMale.toFixed(2) + "%");
                $('#math-percentageGTenMale').text(percentageMathGTenMale.toFixed(2) + "%");
                $('#nature-percentageGTenMale').text(percentageNatureGTenMale.toFixed(2) + "%");
                $('#physical-percentageGTenMale').text(percentagePhysicalGTenMale.toFixed(2) + "%");
                $('#informatics-percentageGTenMale').text(percentageInformaticsGTenMale.toFixed(2) + "%");
                $('#fine-percentageGTenMale').text(percentageFineGTenMale.toFixed(2) + "%");
                $('#music-percentageGTenMale').text(percentageMusicGTenMale.toFixed(2) + "%");
                $('#athletic-percentageGTenMale').text(percentageAthleticGTenMale.toFixed(2) + "%");
                $('#rate-percentageGTenMale').text(percentageRateGTenMale.toFixed(2) + "%");

                // Update the HTML elements with the means for each subject
                $('#arabic-countBEightAndNineMale').text(countArabicBetweenEightAndNineMale);
                $('#amazigh-countBEightAndNineMale').text(countAmazighBetweenEightAndNineMale);
                $('#french-countBEightAndNineMale').text(countFrenchBetweenEightAndNineMale);
                $('#english-countBEightAndNineMale').text(countEnglishBetweenEightAndNineMale);
                $('#islamic-countBEightAndNineMale').text(countIslamicBetweenEightAndNineMale);
                $('#civics-countBEightAndNineMale').text(countCivicsBetweenEightAndNineMale);
                $('#historyandgeography-countBEightAndNineMale').text(countHistoryGeographyBetweenEightAndNineMale);
                $('#math-countBEightAndNineMale').text(countMathBetweenEightAndNineMale);
                $('#nature-countBEightAndNineMale').text(countNatureBetweenEightAndNineMale);
                $('#physical-countBEightAndNineMale').text(countPhysicalBetweenEightAndNineMale);
                $('#informatics-countBEightAndNineMale').text(countInformaticsBetweenEightAndNineMale);
                $('#fine-countBEightAndNineMale').text(countFineBetweenEightAndNineMale);
                $('#music-countBEightAndNineMale').text(countMusicBetweenEightAndNineMale);
                $('#athletic-countBEightAndNineMale').text(countAthleticBetweenEightAndNineMale);
                $('#rate-countBEightAndNineMale').text(countRateBetweenEightAndNineMale);

                // Update the HTML elements with the means for each subject
                $('#arabic-percentageBEightAndNineMale').text(percentageArabicBetweenEightAndNineMale.toFixed(2) + "%");
                $('#amazigh-percentageBEightAndNineMale').text(percentageAmazighBetweenEightAndNineMale.toFixed(2) + "%");
                $('#french-percentageBEightAndNineMale').text(percentageFrenchBetweenEightAndNineMale.toFixed(2) + "%");
                $('#english-percentageBEightAndNineMale').text(percentageEnglishBetweenEightAndNineMale.toFixed(2) + "%");
                $('#islamic-percentageBEightAndNineMale').text(percentageIslamicBetweenEightAndNineMale.toFixed(2) + "%");
                $('#civics-percentageBEightAndNineMale').text(percentageCivicsBetweenEightAndNineMale.toFixed(2) + "%");
                $('#historyandgeography-percentageBEightAndNineMale').text(percentageHistoryAndGeographyBetweenEightAndNineMale.toFixed(2) + "%");
                $('#math-percentageBEightAndNineMale').text(percentageMathBetweenEightAndNineMale.toFixed(2) + "%");
                $('#nature-percentageBEightAndNineMale').text(percentageNatureBetweenEightAndNineMale.toFixed(2) + "%");
                $('#physical-percentageBEightAndNineMale').text(percentagePhysicalBetweenEightAndNineMale.toFixed(2) + "%");
                $('#informatics-percentageBEightAndNineMale').text(percentageInformaticsBetweenEightAndNineMale.toFixed(2) + "%");
                $('#fine-percentageBEightAndNineMale').text(percentageFineBetweenEightAndNineMale.toFixed(2) + "%");
                $('#music-percentageBEightAndNineMale').text(percentageMusicBetweenEightAndNineMale.toFixed(2) + "%");
                $('#athletic-percentageBEightAndNineMale').text(percentageAthleticBetweenEightAndNineMale.toFixed(2) + "%");
                $('#rate-percentageBEightAndNineMale').text(percentageRateBetweenEightAndNineMale.toFixed(2) + "%");

                // Update the HTML elements with the means for each subject
                $('#arabic-countLEightMale').text(countArabicLessThanEightMale);
                $('#amazigh-countLEightMale').text(countAmazighLessThanEightMale);
                $('#french-countLEightMale').text(countFrenchLessThanEightMale);
                $('#english-countLEightMale').text(countEnglishLessThanEightMale);
                $('#islamic-countLEightMale').text(countIslamicLessThanEightMale);
                $('#civics-countLEightMale').text(countCivicsLessThanEightMale);
                $('#historyandgeography-countLEightMale').text(countHistoryGeographyLessThanEightMale);
                $('#math-countLEightMale').text(countMathLessThanEightMale);
                $('#nature-countLEightMale').text(countNatureLessThanEightMale);
                $('#physical-countLEightMale').text(countPhysicalLessThanEightMale);
                $('#informatics-countLEightMale').text(countInformaticsLessThanEightMale);
                $('#fine-countLEightMale').text(countFineLessThanEightMale);
                $('#music-countLEightMale').text(countMusicLessThanEightMale);
                $('#athletic-countLEightMale').text(countAthleticLessThanEightMale);
                $('#rate-countLEightMale').text(countRateLessThanEightMale);

                // Update the HTML elements with the means for each subject
                $('#arabic-percentageLEightMale').text(percentageArabicLessThanEightMale.toFixed(2) + "%");
                $('#amazigh-percentageLEightMale').text(percentageAmazighLessThanEightMale.toFixed(2) + "%");
                $('#french-percentageLEightMale').text(percentageFrenchLessThanEightMale.toFixed(2) + "%");
                $('#english-percentageLEightMale').text(percentageEnglishLessThanEightMale.toFixed(2) + "%");
                $('#islamic-percentageLEightMale').text(percentageIslamicLessThanEightMale.toFixed(2) + "%");
                $('#civics-percentageLEightMale').text(percentageCivicsLessThanEightMale.toFixed(2) + "%");
                $('#historyandgeography-percentageLEightMale').text(percentageHistoryAndGeographyLessThanEightMale.toFixed(2) + "%");
                $('#math-percentageLEightMale').text(percentageMathLessThanEightMale.toFixed(2) + "%");
                $('#nature-percentageLEightMale').text(percentageNatureLessThanEightMale.toFixed(2) + "%");
                $('#physical-percentageLEightMale').text(percentagePhysicalLessThanEightMale.toFixed(2) + "%");
                $('#informatics-percentageLEightMale').text(percentageInformaticsLessThanEightMale.toFixed(2) + "%");
                $('#fine-percentageLEightMale').text(percentageFineLessThanEightMale.toFixed(2) + "%");
                $('#music-percentageLEightMale').text(percentageMusicLessThanEightMale.toFixed(2) + "%");
                $('#athletic-percentageLEightMale').text(percentageAthleticLessThanEightMale.toFixed(2) + "%");
                $('#rate-percentageLEightMale').text(percentageRateLessThanEightMale.toFixed(2) + "%");


                // Calculate Gender DataTable for Female
                // Initialize counters for each subject
                let countarabicFemale = 0;
                let countamazighFemale = 0;
                let countfrenchFemale = 0;
                let countenglishFemale = 0;
                let countislamicFemale = 0;
                let countcivicsFemale = 0;
                let counthistoryandgeographyFemale = 0;
                let countmathFemale = 0;
                let countnatureFemale = 0;
                let countphysicalFemale = 0;
                let countinformaticsFemale = 0;
                let countfineFemale = 0;
                let countmusicFemale = 0;
                let countathleticFemale = 0;
                let countrateFemale = 0;

                // Iterate over each row in the table
                table.rows().every(function() {
                    const rowData = this.data();

                    // Check each subject for values greater than or equal to 1
                    const gender = rowData['الجنس'];

                    const arabicValue = parseFloat(rowData['اللغة العربية ف 2']) || 0;
                    const amazighValue = parseFloat(rowData['اللغة اﻷمازيغية ف 2']) || 0;
                    const frenchValue = parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
                    const englishValue = parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
                    const islamicValue = parseFloat(rowData['التربية الإسلامية ف 2']) || 0;
                    const civicsValue = parseFloat(rowData['التربية المدنية ف 2']) || 0;
                    const historyandgeographyValue = parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
                    const mathValue = parseFloat(rowData['الرياضيات ف 2']) || 0;
                    const natureValue = parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
                    const physicalValue = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                    const informaticsValue = parseFloat(rowData['المعلوماتية ف 2']) || 0;
                    const fineValue = parseFloat(rowData['التربية التشكيلية ف 2']) || 0;
                    const musicValue = parseFloat(rowData['التربية الموسيقية ف 2']) || 0;
                    const athleticValue = parseFloat(rowData['ت البدنية و الرياضية ف 2']) || 0;
                    const rateValue = parseFloat(rowData['معدل الفصل 2']) || 0;

                   
                    if (gender === "أنثى" && arabicValue >= 1) {
                        countarabicFemale++;
                    }
                    if (gender === "أنثى" && amazighValue >= 1) {
                        countamazighFemale++;
                    }
                    if (gender === "أنثى" && frenchValue >= 1) {
                        countfrenchFemale++;
                    }
                    if (gender === "أنثى" && englishValue >= 1) {
                        countenglishFemale++;
                    }
                    if (gender === "أنثى" && islamicValue >= 1) {
                        countislamicFemale++;
                    }
                    if (gender === "أنثى" && civicsValue >= 1) {
                        countcivicsFemale++;
                    }
                    if (gender === "أنثى" && historyandgeographyValue >= 1) {
                        counthistoryandgeographyFemale++;
                    }
                    if (gender === "أنثى" && mathValue >= 1) {
                        countmathFemale++;
                    }
                    if (gender === "أنثى" && natureValue >= 1) {
                        countnatureFemale++;
                    }
                    if (gender === "أنثى" && physicalValue >= 1) {
                        countphysicalFemale++;
                    }
                    if (gender === "أنثى" && informaticsValue >= 1) {
                        countinformaticsFemale++;
                    }
                    if (gender === "أنثى" && fineValue >= 1) {
                        countfineFemale++;
                    }
                    if (gender === "أنثى" && musicValue >= 1) {
                        countmusicFemale++;
                    }
                    if (gender === "أنثى" && athleticValue >= 1) {
                        countathleticFemale++;
                    }
                    if (gender === "أنثى" && rateValue >= 1) {
                        countrateFemale++;
                    }

                    // Continue iteration over rows
                    return true;
                });

                // Update the HTML elements with the counts for each subject
                $('#arabic-countFemale').text(countarabicFemale);
                $('#amazigh-countFemale').text(countamazighFemale);
                $('#french-countFemale').text(countfrenchFemale);
                $('#english-countFemale').text(countenglishFemale);
                $('#islamic-countFemale').text(countislamicFemale);
                $('#civics-countFemale').text(countcivicsFemale);
                $('#historyandgeography-countFemale').text(counthistoryandgeographyFemale);
                $('#math-countFemale').text(countmathFemale);
                $('#nature-countFemale').text(countnatureFemale);
                $('#physical-countFemale').text(countphysicalFemale);
                $('#informatics-countFemale').text(countinformaticsFemale);
                $('#fine-countFemale').text(countfineFemale);
                $('#music-countFemale').text(countmusicFemale);
                $('#athletic-countFemale').text(countathleticFemale);
                $('#rate-countFemale').text(countrateFemale);


                // Initialize variables for sum and count
                let sumArabicFemale = 0;
                let sumAmazighFemale = 0;
                let sumFrenchFemale = 0;
                let sumEnglishFemale = 0;
                let sumIslamicFemale = 0;
                let sumCivicsFemale = 0;
                let sumHistoryGeographyFemale = 0;
                let sumMathFemale = 0;
                let sumNatureFemale = 0;
                let sumPhysicalFemale = 0;
                let sumInformaticsFemale = 0;
                let sumFineFemale = 0;
                let sumMusicFemale = 0;
                let sumAthleticFemale = 0;
                let sumRateFemale = 0;

                let countArabicFemale = 0;
                let countAmazighFemale = 0;
                let countFrenchFemale = 0;
                let countEnglishFemale = 0;
                let countIslamicFemale = 0;
                let countCivicsFemale = 0;
                let countHistoryGeographyFemale = 0;
                let countMathFemale = 0;
                let countNatureFemale = 0;
                let countPhysicalFemale = 0;
                let countInformaticsFemale = 0;
                let countFineFemale = 0;
                let countMusicFemale = 0;
                let countAthleticFemale = 0;
                let countRateFemale = 0;

                let countArabicGTenFemale = 0;
                let countAmazighGTenFemale = 0;
                let countFrenchGTenFemale = 0;
                let countEnglishGTenFemale = 0;
                let countIslamicGTenFemale = 0;
                let countCivicsGTenFemale = 0;
                let countHistoryGeographyGTenFemale = 0;
                let countMathGTenFemale = 0;
                let countNatureGTenFemale = 0;
                let countPhysicalGTenFemale = 0;
                let countInformaticsGTenFemale = 0;
                let countFineGTenFemale = 0;
                let countMusicGTenFemale = 0;
                let countAthleticGTenFemale = 0;
                let countRateGTenFemale = 0;

                let countArabicBetweenEightAndNineFemale = 0;
                let countAmazighBetweenEightAndNineFemale = 0;
                let countFrenchBetweenEightAndNineFemale = 0;
                let countEnglishBetweenEightAndNineFemale = 0;
                let countIslamicBetweenEightAndNineFemale = 0;
                let countCivicsBetweenEightAndNineFemale = 0;
                let countHistoryGeographyBetweenEightAndNineFemale = 0;
                let countMathBetweenEightAndNineFemale = 0;
                let countNatureBetweenEightAndNineFemale = 0;
                let countPhysicalBetweenEightAndNineFemale = 0;
                let countInformaticsBetweenEightAndNineFemale = 0;
                let countFineBetweenEightAndNineFemale = 0;
                let countMusicBetweenEightAndNineFemale = 0;
                let countAthleticBetweenEightAndNineFemale = 0;
                let countRateBetweenEightAndNineFemale = 0;

                let countArabicLessThanEightFemale = 0;
                let countAmazighLessThanEightFemale = 0;
                let countFrenchLessThanEightFemale = 0;
                let countEnglishLessThanEightFemale = 0;
                let countIslamicLessThanEightFemale = 0;
                let countCivicsLessThanEightFemale = 0;
                let countHistoryGeographyLessThanEightFemale = 0;
                let countMathLessThanEightFemale = 0;
                let countNatureLessThanEightFemale = 0;
                let countPhysicalLessThanEightFemale = 0;
                let countInformaticsLessThanEightFemale = 0;
                let countFineLessThanEightFemale = 0;
                let countMusicLessThanEightFemale = 0;
                let countAthleticLessThanEightFemale = 0;
                let countRateLessThanEightFemale= 0;

                // Iterate over each row in the table
                table.rows().every(function () {
                    const rowData = this.data();

                    const gender = rowData['الجنس'];

                    const arabicValue = parseFloat(rowData['اللغة العربية ف 2']) || 0;
                    const amazighValue = parseFloat(rowData['اللغة اﻷمازيغية ف 2']) || 0;
                    const frenchValue = parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
                    const englishValue = parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
                    const islamicValue = parseFloat(rowData['التربية الإسلامية ف 2']) || 0;
                    const civicsValue = parseFloat(rowData['التربية المدنية ف 2']) || 0;
                    const historyGeographyValue = parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
                    const mathValue = parseFloat(rowData['الرياضيات ف 2']) || 0;
                    const natureValue = parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
                    const physicalValue = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                    const informaticsValue = parseFloat(rowData['المعلوماتية ف 2']) || 0;
                    const fineValue = parseFloat(rowData['التربية التشكيلية ف 2']) || 0;
                    const musicValue = parseFloat(rowData['التربية الموسيقية ف 2']) || 0;
                    const athleticValue = parseFloat(rowData['ت البدنية و الرياضية ف 2']) || 0;
                    const rateValue = parseFloat(rowData['معدل الفصل 2']) || 0;

                    if (gender === "أنثى" && arabicValue >= 1) {
                        sumArabicFemale += arabicValue;
                        countArabicFemale++;
                    }
                    if (gender === "أنثى" && amazighValue >= 1) {
                        sumAmazighFemale += amazighValue;
                        countAmazighFemale++;
                    }
                    if (gender === "أنثى" && frenchValue >= 1) {
                        sumFrenchFemale += frenchValue;
                        countFrenchFemale++;
                    }
                    if (gender === "أنثى" && englishValue >= 1) {
                        sumEnglishFemale += englishValue;
                        countEnglishFemale++;
                    }
                    if (gender === "أنثى" && islamicValue >= 1) {
                        sumIslamicFemale += islamicValue;
                        countIslamicFemale++;
                    }
                    if (gender === "أنثى" && civicsValue >= 1) {
                        sumCivicsFemale += civicsValue;
                        countCivicsFemale++;
                    }
                    if (gender === "أنثى" && historyGeographyValue >= 1) {
                        sumHistoryGeographyFemale += historyGeographyValue;
                        countHistoryGeographyFemale++;
                    }
                    if (gender === "أنثى" && mathValue >= 1) {
                        sumMathFemale += mathValue;
                        countMathFemale++;
                    }
                    if (gender === "أنثى" && natureValue >= 1) {
                        sumNatureFemale += natureValue;
                        countNatureFemale++;
                    }
                    if (gender === "أنثى" && physicalValue >= 1) {
                        sumPhysicalFemale += physicalValue;
                        countPhysicalFemale++;
                    }
                    if (gender === "أنثى" && informaticsValue >= 1) {
                        sumInformaticsFemale += informaticsValue;
                        countInformaticsFemale++;
                    }
                    if (gender === "أنثى" && fineValue >= 1) {
                        sumFineFemale += fineValue;
                        countFineFemale++;
                    }
                    if (gender === "أنثى" && musicValue >= 1) {
                        sumMusicFemale += musicValue;
                        countMusicFemale++;
                    }
                    if (gender === "أنثى" && athleticValue >= 1) {
                        sumAthleticFemale += athleticValue;
                        countAthleticFemale++;
                    }
                    if (gender === "أنثى" && rateValue >= 1) {
                        sumRateFemale += rateValue;
                        countRateFemale++;
                    }

                    // Greater than ten
                    if (gender === "أنثى" && arabicValue >= 10) {
                        countArabicGTenFemale++;
                    }
                    if (gender === "أنثى" && amazighValue >= 10) {
                        countAmazighGTenFemale++;
                    }
                    if (gender === "أنثى" && frenchValue >= 10) {
                        countFrenchGTenFemale++;
                    }
                    if (gender === "أنثى" && englishValue >= 10) {
                        countEnglishGTenFemale++;
                    }
                    if (gender === "أنثى" && islamicValue >= 10) {
                        countIslamicGTenFemale++;
                    }
                    if (gender === "أنثى" && civicsValue >= 10) {
                        countCivicsGTenFemale++;
                    }
                    if (gender === "أنثى" && historyGeographyValue >= 10) {
                        countHistoryGeographyGTenFemale++;
                    }
                    if (gender === "أنثى" && mathValue >= 10) {
                        countMathGTenFemale++;
                    }
                    if (gender === "أنثى" && natureValue >= 10) {
                        countNatureGTenFemale++;
                    }
                    if (gender === "أنثى" && physicalValue >= 10) {
                        countPhysicalGTenFemale++;
                    }
                    if (gender === "أنثى" && informaticsValue >= 10) {
                        countInformaticsGTenFemale++;
                    }
                    if (gender === "أنثى" && fineValue >= 10) {
                        countFineGTenFemale++;
                    }
                    if (gender === "أنثى" && musicValue >= 10) {
                        countMusicGTenFemale++;
                    }
                    if (gender === "أنثى" && athleticValue >= 10) {
                        countAthleticGTenFemale++;
                    }
                    if (gender === "أنثى" && rateValue >= 10) {
                        countRateGTenFemale++;
                    }

                    // Greater or Equal 8 and Less or Equal 9.99
                    if (gender === "أنثى" && arabicValue >= 8 && arabicValue <= 9.99) {
                        countArabicBetweenEightAndNineFemale++;
                    }
                    if (gender === "أنثى" && amazighValue >= 8 && amazighValue <= 9.99) {
                        countAmazighBetweenEightAndNineFemale++;
                    }
                    if (gender === "أنثى" && frenchValue >= 8 && frenchValue <= 9.99) {
                        countFrenchBetweenEightAndNineFemale++;
                    }
                    if (gender === "أنثى" && englishValue >= 8 && englishValue <= 9.99) {
                        countEnglishBetweenEightAndNineFemale++;
                    }
                    if (gender === "أنثى" && islamicValue >= 8 && islamicValue <= 9.99) {
                        countIslamicBetweenEightAndNineFemale++;
                    }
                    if (gender === "أنثى" && civicsValue >= 8 && civicsValue <= 9.99) {
                        countCivicsBetweenEightAndNineFemale++;
                    }
                    if (gender === "أنثى" && historyGeographyValue >= 8 && historyGeographyValue <= 9.99) {
                        countHistoryGeographyBetweenEightAndNineFemale++;
                    }
                    if (gender === "أنثى" && mathValue >= 8 && mathValue <= 9.99) {
                        countMathBetweenEightAndNineFemale++;
                    }
                    if (gender === "أنثى" && natureValue >= 8 && natureValue <= 9.99) {
                        countNatureBetweenEightAndNineFemale++;
                    }
                    if (gender === "أنثى" && physicalValue >= 8 && physicalValue <= 9.99) {
                        countPhysicalBetweenEightAndNineFemale++;
                    }
                    if (gender === "أنثى" && informaticsValue >= 8 && informaticsValue <= 9.99) {
                        countInformaticsBetweenEightAndNineFemale++;
                    }
                    if (gender === "أنثى" && fineValue >= 8 && fineValue <= 9.99) {
                        countFineBetweenEightAndNineFemale++;
                    }
                    if (gender === "أنثى" && musicValue >= 8 && musicValue <= 9.99) {
                        countMusicBetweenEightAndNineFemale++;
                    }
                    if (gender === "أنثى" && athleticValue >= 8 && athleticValue <= 9.99) {
                        countAthleticBetweenEightAndNineFemale++;
                    }
                    if (gender === "أنثى" && rateValue >= 8 && rateValue <= 9.99) {
                        countRateBetweenEightAndNineFemale++;
                    }

                    // Greater or Equal 1 and Less or Equal 8
                    if (gender === "أنثى" && arabicValue >= 1 && arabicValue <= 8) {
                        countArabicLessThanEightFemale++;
                    }
                    if (gender === "أنثى" && amazighValue >= 1 && amazighValue <= 8) {
                        countAmazighLessThanEightFemale++;
                    }
                    if (gender === "أنثى" && frenchValue >= 1 && frenchValue <= 8) {
                        countFrenchLessThanEightFemale++;
                    }
                    if (gender === "أنثى" && englishValue >= 1 && englishValue <= 8) {
                        countEnglishLessThanEightFemale++;
                    }
                    if (gender === "أنثى" && islamicValue >= 1 && islamicValue <= 8) {
                        countIslamicLessThanEightFemale++;
                    }
                    if (gender === "أنثى" && civicsValue >= 1 && civicsValue <= 8) {
                        countCivicsLessThanEightFemale++;
                    }
                    if (gender === "أنثى" && historyGeographyValue >= 1 && historyGeographyValue <= 8) {
                        countHistoryGeographyLessThanEightFemale++;
                    }
                    if (gender === "أنثى" && mathValue >= 1 && mathValue <= 8) {
                        countMathLessThanEightFemale++;
                    }
                    if (gender === "أنثى" && natureValue >= 1 && natureValue <= 8) {
                        countNatureLessThanEightFemale++;
                    }
                    if (gender === "أنثى" && physicalValue >= 1 && physicalValue <= 8) {
                        countPhysicalLessThanEightFemale++;
                    }
                    if (gender === "أنثى" && informaticsValue >= 1 && informaticsValue <= 8) {
                        countInformaticsLessThanEightFemale++;
                    }
                    if (gender === "أنثى" && fineValue >= 1 && fineValue <= 8) {
                        countFineLessThanEightFemale++;
                    }
                    if (gender === "أنثى" && musicValue >= 1 && musicValue <= 8) {
                        countMusicLessThanEightFemale++;
                    }
                    if (gender === "أنثى" && athleticValue >= 1 && athleticValue <= 8) {
                        countAthleticLessThanEightFemale++;
                    }
                    if (gender === "أنثى" && rateValue >= 1 && rateValue <= 8) {
                        countRateLessThanEightFemale++;
                    } 
                    // Continue iteration over rows
                    return true;
                });

                // Calculate mean
                const meanArabicFemale = countArabicFemale > 0 ? sumArabicFemale / countArabicFemale : 0;
                const meanAmazighFemale = countAmazighFemale > 0 ? sumAmazighFemale / countAmazighFemale : 0;
                const meanFrenchFemale = countFrenchFemale > 0 ? sumFrenchFemale / countFrenchFemale : 0;
                const meanEnglishFemale = countEnglishFemale > 0 ? sumEnglishFemale / countEnglishFemale : 0;
                const meanIslamicFemale = countIslamicFemale > 0 ? sumIslamicFemale / countIslamicFemale : 0;
                const meanCivicsFemale = countCivicsFemale > 0 ? sumCivicsFemale / countCivicsFemale : 0;
                const meanHistoryGeographyFemale = countHistoryGeographyFemale > 0 ? sumHistoryGeographyFemale / countHistoryGeographyFemale : 0;
                const meanMathFemale = countMathFemale > 0 ? sumMathFemale / countMathFemale : 0;
                const meanNatureFemale = countNatureFemale > 0 ? sumNatureFemale / countNatureFemale : 0;
                const meanPhysicalFemale = countPhysicalFemale > 0 ? sumPhysicalFemale / countPhysicalFemale : 0;
                const meanInformaticsFemale = countInformaticsFemale > 0 ? sumInformaticsFemale / countInformaticsFemale : 0;
                const meanFineFemale = countFineFemale > 0 ? sumFineFemale / countFineFemale : 0;
                const meanMusicFemale = countMusicFemale > 0 ? sumMusicFemale / countMusicFemale : 0;
                const meanAthleticFemale = countAthleticFemale > 0 ? sumAthleticFemale / countAthleticFemale : 0;
                const meanRateFemale = countRateFemale > 0 ? sumRateFemale / countRateFemale : 0;

                // Calculate the percentage of values greater than or equal to 10 for each subject
                const percentageArabicGTenFemale = countArabicFemale !== 0 ? (countArabicGTenFemale / countArabicFemale) * 100 : 0;
                const percentageAmazighGTenFemale = countAmazighFemale !== 0 ? (countAmazighGTenFemale / countAmazighFemale) * 100 : 0;
                const percentageFrenchGTenFemale = countFrenchFemale !== 0 ? (countFrenchGTenFemale / countFrenchFemale) * 100 : 0;
                const percentageEnglishGTenFemale = countEnglishFemale !== 0 ? (countEnglishGTenFemale / countEnglishFemale) * 100 : 0;
                const percentageIslamicGTenFemale = countIslamicFemale !== 0 ? (countIslamicGTenFemale / countIslamicFemale) * 100 : 0;
                const percentageCivicsGTenFemale = countCivicsFemale !== 0 ? (countCivicsGTenFemale / countCivicsFemale) * 100 : 0;
                const percentageHistoryAndGeographyGTenFemale = countHistoryGeographyFemale !== 0 ? (countHistoryGeographyGTenFemale / countHistoryGeographyFemale) * 100 : 0;
                const percentageMathGTenFemale = countMathFemale !== 0 ? (countMathGTenFemale / countMathFemale) * 100 : 0;
                const percentageNatureGTenFemale = countNatureFemale !== 0 ? (countNatureGTenFemale / countNatureFemale) * 100 : 0;
                const percentagePhysicalGTenFemale = countPhysicalFemale !== 0 ? (countPhysicalGTenFemale / countPhysicalFemale) * 100 : 0;
                const percentageInformaticsGTenFemale = countInformaticsFemale !== 0 ? (countInformaticsGTenFemale / countInformaticsFemale) * 100 : 0;
                const percentageFineGTenFemale = countFineFemale !== 0 ? (countFineGTenFemale / countFineFemale) * 100 : 0;
                const percentageMusicGTenFemale = countMusicFemale !== 0 ? (countMusicGTenFemale / countMusicFemale) * 100 : 0;
                const percentageAthleticGTenFemale = countAthleticFemale !== 0 ? (countAthleticGTenFemale / countAthleticFemale) * 100 : 0;
                const percentageRateGTenFemale = countRateFemale !== 0 ? (countRateGTenFemale / countRateFemale) * 100 : 0;

                // Calculate the percentage of values greater than or equal to 8 less than or equal to 9.99 for each subject
                const percentageArabicBetweenEightAndNineFemale = countArabicFemale !== 0 ? (countArabicBetweenEightAndNineFemale / countArabicFemale) * 100 : 0;
                const percentageAmazighBetweenEightAndNineFemale = countAmazighFemale !== 0 ? (countAmazighBetweenEightAndNineFemale / countAmazighFemale) * 100 : 0;
                const percentageFrenchBetweenEightAndNineFemale = countFrenchFemale !== 0 ? (countFrenchBetweenEightAndNineFemale / countFrenchFemale) * 100 : 0;
                const percentageEnglishBetweenEightAndNineFemale = countEnglishFemale !== 0 ? (countEnglishBetweenEightAndNineFemale / countEnglishFemale) * 100 : 0;
                const percentageIslamicBetweenEightAndNineFemale = countIslamicFemale !== 0 ? (countIslamicBetweenEightAndNineFemale / countIslamicFemale) * 100 : 0;
                const percentageCivicsBetweenEightAndNineFemale = countCivicsFemale !== 0 ? (countCivicsBetweenEightAndNineFemale / countCivicsFemale) * 100 : 0;
                const percentageHistoryAndGeographyBetweenEightAndNineFemale = countHistoryGeographyFemale !== 0 ? (countHistoryGeographyBetweenEightAndNineFemale / countHistoryGeographyFemale) * 100 : 0;
                const percentageMathBetweenEightAndNineFemale = countMathFemale !== 0 ? (countMathBetweenEightAndNineFemale / countMathFemale) * 100 : 0;
                const percentageNatureBetweenEightAndNineFemale = countNatureFemale !== 0 ? (countNatureBetweenEightAndNineFemale / countNatureFemale) * 100 : 0;
                const percentagePhysicalBetweenEightAndNineFemale = countPhysicalFemale !== 0 ? (countPhysicalBetweenEightAndNineFemale / countPhysicalFemale) * 100 : 0;
                const percentageInformaticsBetweenEightAndNineFemale = countInformaticsFemale !== 0 ? (countInformaticsBetweenEightAndNineFemale / countInformaticsFemale) * 100 : 0;
                const percentageFineBetweenEightAndNineFemale = countFineFemale !== 0 ? (countFineBetweenEightAndNineFemale / countFineFemale) * 100 : 0;
                const percentageMusicBetweenEightAndNineFemale = countMusicFemale !== 0 ? (countMusicBetweenEightAndNineFemale / countMusicFemale) * 100 : 0;
                const percentageAthleticBetweenEightAndNineFemale = countAthleticFemale !== 0 ? (countAthleticBetweenEightAndNineFemale / countAthleticFemale) * 100 : 0;
                const percentageRateBetweenEightAndNineFemale = countRateFemale !== 0 ? (countRateBetweenEightAndNineFemale / countRateFemale) * 100 : 0;

                // Calculate the percentage of values greater than or equal to 1 less than or equal to 8 for each subject
                const percentageArabicLessThanEightFemale = countArabicFemale !== 0 ? (countArabicLessThanEightFemale / countArabicFemale) * 100 : 0;
                const percentageAmazighLessThanEightFemale = countAmazighFemale !== 0 ? (countAmazighLessThanEightFemale / countAmazighFemale) * 100 : 0;
                const percentageFrenchLessThanEightFemale = countFrenchFemale !== 0 ? (countFrenchLessThanEightFemale / countFrenchFemale) * 100 : 0;
                const percentageEnglishLessThanEightFemale = countEnglishFemale !== 0 ? (countEnglishLessThanEightFemale / countEnglishFemale) * 100 : 0;
                const percentageIslamicLessThanEightFemale = countIslamicFemale !== 0 ? (countIslamicLessThanEightFemale / countIslamicFemale) * 100 : 0;
                const percentageCivicsLessThanEightFemale = countCivicsFemale !== 0 ? (countCivicsLessThanEightFemale / countCivicsFemale) * 100 : 0;
                const percentageHistoryAndGeographyLessThanEightFemale = countHistoryGeographyFemale !== 0 ? (countHistoryGeographyLessThanEightFemale / countHistoryGeographyFemale) * 100 : 0;
                const percentageMathLessThanEightFemale = countMathFemale !== 0 ? (countMathLessThanEightFemale / countMathFemale) * 100 : 0;
                const percentageNatureLessThanEightFemale = countNatureFemale !== 0 ? (countNatureLessThanEightFemale / countNatureFemale) * 100 : 0;
                const percentagePhysicalLessThanEightFemale = countPhysicalFemale !== 0 ? (countPhysicalLessThanEightFemale / countPhysicalFemale) * 100 : 0;
                const percentageInformaticsLessThanEightFemale = countInformaticsFemale !== 0 ? (countInformaticsLessThanEightFemale / countInformaticsFemale) * 100 : 0;
                const percentageFineLessThanEightFemale = countFineFemale !== 0 ? (countFineLessThanEightFemale / countFineFemale) * 100 : 0;
                const percentageMusicLessThanEightFemale = countMusicFemale !== 0 ? (countMusicLessThanEightFemale / countMusicFemale) * 100 : 0;
                const percentageAthleticLessThanEightFemale = countAthleticFemale !== 0 ? (countAthleticLessThanEightFemale / countAthleticFemale) * 100 : 0;
                const percentageRateLessThanEightFemale = countRateFemale !== 0 ? (countRateLessThanEightFemale / countRateFemale) * 100 : 0;
                    
                // Update the HTML elements with the means for each subject
                $('#arabic-meanFemale').text(meanArabicFemale.toFixed(2));
                $('#amazigh-meanFemale').text(meanAmazighFemale.toFixed(2));
                $('#french-meanFemale').text(meanFrenchFemale.toFixed(2));
                $('#english-meanFemale').text(meanEnglishFemale.toFixed(2));
                $('#islamic-meanFemale').text(meanIslamicFemale.toFixed(2));
                $('#civics-meanFemale').text(meanCivicsFemale.toFixed(2));
                $('#historyandgeography-meanFemale').text(meanHistoryGeographyFemale.toFixed(2));
                $('#math-meanFemale').text(meanMathFemale.toFixed(2));
                $('#nature-meanFemale').text(meanNatureFemale.toFixed(2));
                $('#physical-meanFemale').text(meanPhysicalFemale.toFixed(2));
                $('#informatics-meanFemale').text(meanInformaticsFemale.toFixed(2));
                $('#fine-meanFemale').text(meanFineFemale.toFixed(2));
                $('#music-meanFemale').text(meanMusicFemale.toFixed(2));
                $('#athletic-meanFemale').text(meanAthleticFemale.toFixed(2));
                $('#rate-meanFemale').text(meanRateFemale.toFixed(2));

                // Add badge dynamically based on mean value
                addBadgeFemale('#arabic-meanFemale', meanArabicFemale);
                addBadgeFemale('#amazigh-meanFemale', meanAmazighFemale);
                addBadgeFemale('#french-meanFemale', meanFrenchFemale);
                addBadgeFemale('#english-meanFemale', meanEnglishFemale);
                addBadgeFemale('#islamic-meanFemale', meanIslamicFemale);
                addBadgeFemale('#civics-meanFemale', meanCivicsFemale);
                addBadgeFemale('#historyandgeography-meanFemale', meanHistoryGeographyFemale);
                addBadgeFemale('#math-meanFemale', meanMathFemale);
                addBadgeFemale('#nature-meanFemale', meanNatureFemale);
                addBadgeFemale('#physical-meanFemale', meanPhysicalFemale);
                addBadgeFemale('#informatics-meanFemale', meanInformaticsFemale);
                addBadgeFemale('#fine-meanFemale', meanFineFemale);
                addBadgeFemale('#music-meanFemale', meanMusicFemale);
                addBadgeFemale('#athletic-meanFemale', meanAthleticFemale);
                addBadgeFemale('#rate-meanFemale', meanRateFemale);

                function addBadgeFemale(selectorFemale, Female) {
                    if (Female >=1 && Female < 10) {
                        $(selectorFemale).append('<span class="badge-1" title="تحصل التلاميذ على معدل أو نسبة تقل عن المتوسط">ضعيف</span>');
                    }
                }

                // Update the HTML elements with the means for each subject
                $('#arabic-countGTenFemale').text(countArabicGTenFemale);
                $('#amazigh-countGTenFemale').text(countAmazighGTenFemale);
                $('#french-countGTenFemale').text(countFrenchGTenFemale);
                $('#english-countGTenFemale').text(countEnglishGTenFemale);
                $('#islamic-countGTenFemale').text(countIslamicGTenFemale);
                $('#civics-countGTenFemale').text(countCivicsGTenFemale);
                $('#historyandgeography-countGTenFemale').text(countHistoryGeographyGTenFemale);
                $('#math-countGTenFemale').text(countMathGTenFemale);
                $('#nature-countGTenFemale').text(countNatureGTenFemale);
                $('#physical-countGTenFemale').text(countPhysicalGTenFemale);
                $('#informatics-countGTenFemale').text(countInformaticsGTenFemale);
                $('#fine-countGTenFemale').text(countFineGTenFemale);
                $('#music-countGTenFemale').text(countMusicGTenFemale);
                $('#athletic-countGTenFemale').text(countAthleticGTenFemale);
                $('#rate-countGTenFemale').text(countRateGTenFemale);

                // Update the HTML elements with the means for each subject
                $('#arabic-percentageGTenFemale').text(percentageArabicGTenFemale.toFixed(2) + "%");
                $('#amazigh-percentageGTenFemale').text(percentageAmazighGTenFemale.toFixed(2) + "%");
                $('#french-percentageGTenFemale').text(percentageFrenchGTenFemale.toFixed(2) + "%");
                $('#english-percentageGTenFemale').text(percentageEnglishGTenFemale.toFixed(2) + "%");
                $('#islamic-percentageGTenFemale').text(percentageIslamicGTenFemale.toFixed(2) + "%");
                $('#civics-percentageGTenFemale').text(percentageCivicsGTenFemale.toFixed(2) + "%");
                $('#historyandgeography-percentageGTenFemale').text(percentageHistoryAndGeographyGTenFemale.toFixed(2) + "%");
                $('#math-percentageGTenFemale').text(percentageMathGTenFemale.toFixed(2) + "%");
                $('#nature-percentageGTenFemale').text(percentageNatureGTenFemale.toFixed(2) + "%");
                $('#physical-percentageGTenFemale').text(percentagePhysicalGTenFemale.toFixed(2) + "%");
                $('#informatics-percentageGTenFemale').text(percentageInformaticsGTenFemale.toFixed(2) + "%");
                $('#fine-percentageGTenFemale').text(percentageFineGTenFemale.toFixed(2) + "%");
                $('#music-percentageGTenFemale').text(percentageMusicGTenFemale.toFixed(2) + "%");
                $('#athletic-percentageGTenFemale').text(percentageAthleticGTenFemale.toFixed(2) + "%");
                $('#rate-percentageGTenFemale').text(percentageRateGTenFemale.toFixed(2) + "%");

                // Update the HTML elements with the means for each subject
                $('#arabic-countBEightAndNineFemale').text(countArabicBetweenEightAndNineFemale);
                $('#amazigh-countBEightAndNineFemale').text(countAmazighBetweenEightAndNineFemale);
                $('#french-countBEightAndNineFemale').text(countFrenchBetweenEightAndNineFemale);
                $('#english-countBEightAndNineFemale').text(countEnglishBetweenEightAndNineFemale);
                $('#islamic-countBEightAndNineFemale').text(countIslamicBetweenEightAndNineFemale);
                $('#civics-countBEightAndNineFemale').text(countCivicsBetweenEightAndNineFemale);
                $('#historyandgeography-countBEightAndNineFemale').text(countHistoryGeographyBetweenEightAndNineFemale);
                $('#math-countBEightAndNineFemale').text(countMathBetweenEightAndNineFemale);
                $('#nature-countBEightAndNineFemale').text(countNatureBetweenEightAndNineFemale);
                $('#physical-countBEightAndNineFemale').text(countPhysicalBetweenEightAndNineFemale);
                $('#informatics-countBEightAndNineFemale').text(countInformaticsBetweenEightAndNineFemale);
                $('#fine-countBEightAndNineFemale').text(countFineBetweenEightAndNineFemale);
                $('#music-countBEightAndNineFemale').text(countMusicBetweenEightAndNineFemale);
                $('#athletic-countBEightAndNineFemale').text(countAthleticBetweenEightAndNineFemale);
                $('#rate-countBEightAndNineFemale').text(countRateBetweenEightAndNineFemale);

                // Update the HTML elements with the means for each subject
                $('#arabic-percentageBEightAndNineFemale').text(percentageArabicBetweenEightAndNineFemale.toFixed(2) + "%");
                $('#amazigh-percentageBEightAndNineFemale').text(percentageAmazighBetweenEightAndNineFemale.toFixed(2) + "%");
                $('#french-percentageBEightAndNineFemale').text(percentageFrenchBetweenEightAndNineFemale.toFixed(2) + "%");
                $('#english-percentageBEightAndNineFemale').text(percentageEnglishBetweenEightAndNineFemale.toFixed(2) + "%");
                $('#islamic-percentageBEightAndNineFemale').text(percentageIslamicBetweenEightAndNineFemale.toFixed(2) + "%");
                $('#civics-percentageBEightAndNineFemale').text(percentageCivicsBetweenEightAndNineFemale.toFixed(2) + "%");
                $('#historyandgeography-percentageBEightAndNineFemale').text(percentageHistoryAndGeographyBetweenEightAndNineFemale.toFixed(2) + "%");
                $('#math-percentageBEightAndNineFemale').text(percentageMathBetweenEightAndNineFemale.toFixed(2) + "%");
                $('#nature-percentageBEightAndNineFemale').text(percentageNatureBetweenEightAndNineFemale.toFixed(2) + "%");
                $('#physical-percentageBEightAndNineFemale').text(percentagePhysicalBetweenEightAndNineFemale.toFixed(2) + "%");
                $('#informatics-percentageBEightAndNineFemale').text(percentageInformaticsBetweenEightAndNineFemale.toFixed(2) + "%");
                $('#fine-percentageBEightAndNineFemale').text(percentageFineBetweenEightAndNineFemale.toFixed(2) + "%");
                $('#music-percentageBEightAndNineFemale').text(percentageMusicBetweenEightAndNineFemale.toFixed(2) + "%");
                $('#athletic-percentageBEightAndNineFemale').text(percentageAthleticBetweenEightAndNineFemale.toFixed(2) + "%");
                $('#rate-percentageBEightAndNineFemale').text(percentageRateBetweenEightAndNineFemale.toFixed(2) + "%");

                // Update the HTML elements with the means for each subject
                $('#arabic-countLEightFemale').text(countArabicLessThanEightFemale);
                $('#amazigh-countLEightFemale').text(countAmazighLessThanEightFemale);
                $('#french-countLEightFemale').text(countFrenchLessThanEightFemale);
                $('#english-countLEightFemale').text(countEnglishLessThanEightFemale);
                $('#islamic-countLEightFemale').text(countIslamicLessThanEightFemale);
                $('#civics-countLEightFemale').text(countCivicsLessThanEightFemale);
                $('#historyandgeography-countLEightFemale').text(countHistoryGeographyLessThanEightFemale);
                $('#math-countLEightFemale').text(countMathLessThanEightFemale);
                $('#nature-countLEightFemale').text(countNatureLessThanEightFemale);
                $('#physical-countLEightFemale').text(countPhysicalLessThanEightFemale);
                $('#informatics-countLEightFemale').text(countInformaticsLessThanEightFemale);
                $('#fine-countLEightFemale').text(countFineLessThanEightFemale);
                $('#music-countLEightFemale').text(countMusicLessThanEightFemale);
                $('#athletic-countLEightFemale').text(countAthleticLessThanEightFemale);
                $('#rate-countLEightFemale').text(countRateLessThanEightFemale);

                // Update the HTML elements with the means for each subject
                $('#arabic-percentageLEightFemale').text(percentageArabicLessThanEightFemale.toFixed(2) + "%");
                $('#amazigh-percentageLEightFemale').text(percentageAmazighLessThanEightFemale.toFixed(2) + "%");
                $('#french-percentageLEightFemale').text(percentageFrenchLessThanEightFemale.toFixed(2) + "%");
                $('#english-percentageLEightFemale').text(percentageEnglishLessThanEightFemale.toFixed(2) + "%");
                $('#islamic-percentageLEightFemale').text(percentageIslamicLessThanEightFemale.toFixed(2) + "%");
                $('#civics-percentageLEightFemale').text(percentageCivicsLessThanEightFemale.toFixed(2) + "%");
                $('#historyandgeography-percentageLEightFemale').text(percentageHistoryAndGeographyLessThanEightFemale.toFixed(2) + "%");
                $('#math-percentageLEightFemale').text(percentageMathLessThanEightFemale.toFixed(2) + "%");
                $('#nature-percentageLEightFemale').text(percentageNatureLessThanEightFemale.toFixed(2) + "%");
                $('#physical-percentageLEightFemale').text(percentagePhysicalLessThanEightFemale.toFixed(2) + "%");
                $('#informatics-percentageLEightFemale').text(percentageInformaticsLessThanEightFemale.toFixed(2) + "%");
                $('#fine-percentageLEightFemale').text(percentageFineLessThanEightFemale.toFixed(2) + "%");
                $('#music-percentageLEightFemale').text(percentageMusicLessThanEightFemale.toFixed(2) + "%");
                $('#athletic-percentageLEightFemale').text(percentageAthleticLessThanEightFemale.toFixed(2) + "%");
                $('#rate-percentageLEightFemale').text(percentageRateLessThanEightFemale.toFixed(2) + "%");

                // Fail/Success DataTable
                // Calculate Failure DataTable for Failure
                // Initialize counters for each subject
                let countarabicFailure = 0;
                let countamazighFailure = 0;
                let countfrenchFailure = 0;
                let countenglishFailure = 0;
                let countislamicFailure = 0;
                let countcivicsFailure = 0;
                let counthistoryandgeographyFailure = 0;
                let countmathFailure = 0;
                let countnatureFailure = 0;
                let countphysicalFailure = 0;
                let countinformaticsFailure = 0;
                let countfineFailure = 0;
                let countmusicFailure = 0;
                let countathleticFailure = 0;
                let countrateFailure = 0;

                // Iterate over each row in the table
                table.rows().every(function() {
                    const rowData = this.data();

                    // Check each subject for values greater than or equal to 1
                    const gender = rowData['الإعادة'];

                    const arabicValue = parseFloat(rowData['اللغة العربية ف 2']) || 0;
                    const amazighValue = parseFloat(rowData['اللغة اﻷمازيغية ف 2']) || 0;
                    const frenchValue = parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
                    const englishValue = parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
                    const islamicValue = parseFloat(rowData['التربية الإسلامية ف 2']) || 0;
                    const civicsValue = parseFloat(rowData['التربية المدنية ف 2']) || 0;
                    const historyandgeographyValue = parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
                    const mathValue = parseFloat(rowData['الرياضيات ف 2']) || 0;
                    const natureValue = parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
                    const physicalValue = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                    const informaticsValue = parseFloat(rowData['المعلوماتية ف 2']) || 0;
                    const fineValue = parseFloat(rowData['التربية التشكيلية ف 2']) || 0;
                    const musicValue = parseFloat(rowData['التربية الموسيقية ف 2']) || 0;
                    const athleticValue = parseFloat(rowData['ت البدنية و الرياضية ف 2']) || 0;
                    const rateValue = parseFloat(rowData['معدل الفصل 2']) || 0;

                   
                    if (gender === "نعم" && arabicValue >= 1) {
                        countarabicFailure++;
                    }
                    if (gender === "نعم" && amazighValue >= 1) {
                        countamazighFailure++;
                    }
                    if (gender === "نعم" && frenchValue >= 1) {
                        countfrenchFailure++;
                    }
                    if (gender === "نعم" && englishValue >= 1) {
                        countenglishFailure++;
                    }
                    if (gender === "نعم" && islamicValue >= 1) {
                        countislamicFailure++;
                    }
                    if (gender === "نعم" && civicsValue >= 1) {
                        countcivicsFailure++;
                    }
                    if (gender === "نعم" && historyandgeographyValue >= 1) {
                        counthistoryandgeographyFailure++;
                    }
                    if (gender === "نعم" && mathValue >= 1) {
                        countmathFailure++;
                    }
                    if (gender === "نعم" && natureValue >= 1) {
                        countnatureFailure++;
                    }
                    if (gender === "نعم" && physicalValue >= 1) {
                        countphysicalFailure++;
                    }
                    if (gender === "نعم" && informaticsValue >= 1) {
                        countinformaticsFailure++;
                    }
                    if (gender === "نعم" && fineValue >= 1) {
                        countfineFailure++;
                    }
                    if (gender === "نعم" && musicValue >= 1) {
                        countmusicFailure++;
                    }
                    if (gender === "نعم" && athleticValue >= 1) {
                        countathleticFailure++;
                    }
                    if (gender === "نعم" && rateValue >= 1) {
                        countrateFailure++;
                    }

                    // Continue iteration over rows
                    return true;
                });

                // Update the HTML elements with the counts for each subject
                $('#arabic-countFailure').text(countarabicFailure);
                $('#amazigh-countFailure').text(countamazighFailure);
                $('#french-countFailure').text(countfrenchFailure);
                $('#english-countFailure').text(countenglishFailure);
                $('#islamic-countFailure').text(countislamicFailure);
                $('#civics-countFailure').text(countcivicsFailure);
                $('#historyandgeography-countFailure').text(counthistoryandgeographyFailure);
                $('#math-countFailure').text(countmathFailure);
                $('#nature-countFailure').text(countnatureFailure);
                $('#physical-countFailure').text(countphysicalFailure);
                $('#informatics-countFailure').text(countinformaticsFailure);
                $('#fine-countFailure').text(countfineFailure);
                $('#music-countFailure').text(countmusicFailure);
                $('#athletic-countFailure').text(countathleticFailure);
                $('#rate-countFailure').text(countrateFailure);


                // Initialize variables for sum and count
                let sumArabicFailure = 0;
                let sumAmazighFailure = 0;
                let sumFrenchFailure = 0;
                let sumEnglishFailure = 0;
                let sumIslamicFailure = 0;
                let sumCivicsFailure = 0;
                let sumHistoryGeographyFailure = 0;
                let sumMathFailure = 0;
                let sumNatureFailure = 0;
                let sumPhysicalFailure = 0;
                let sumInformaticsFailure = 0;
                let sumFineFailure = 0;
                let sumMusicFailure = 0;
                let sumAthleticFailure = 0;
                let sumRateFailure = 0;

                let countArabicFailure = 0;
                let countAmazighFailure = 0;
                let countFrenchFailure = 0;
                let countEnglishFailure = 0;
                let countIslamicFailure = 0;
                let countCivicsFailure = 0;
                let countHistoryGeographyFailure = 0;
                let countMathFailure = 0;
                let countNatureFailure = 0;
                let countPhysicalFailure = 0;
                let countInformaticsFailure = 0;
                let countFineFailure = 0;
                let countMusicFailure = 0;
                let countAthleticFailure = 0;
                let countRateFailure = 0;

                let countArabicGTenFailure = 0;
                let countAmazighGTenFailure = 0;
                let countFrenchGTenFailure = 0;
                let countEnglishGTenFailure = 0;
                let countIslamicGTenFailure = 0;
                let countCivicsGTenFailure = 0;
                let countHistoryGeographyGTenFailure = 0;
                let countMathGTenFailure = 0;
                let countNatureGTenFailure = 0;
                let countPhysicalGTenFailure = 0;
                let countInformaticsGTenFailure = 0;
                let countFineGTenFailure = 0;
                let countMusicGTenFailure = 0;
                let countAthleticGTenFailure = 0;
                let countRateGTenFailure = 0;

                let countArabicBetweenEightAndNineFailure = 0;
                let countAmazighBetweenEightAndNineFailure = 0;
                let countFrenchBetweenEightAndNineFailure = 0;
                let countEnglishBetweenEightAndNineFailure = 0;
                let countIslamicBetweenEightAndNineFailure = 0;
                let countCivicsBetweenEightAndNineFailure = 0;
                let countHistoryGeographyBetweenEightAndNineFailure = 0;
                let countMathBetweenEightAndNineFailure = 0;
                let countNatureBetweenEightAndNineFailure = 0;
                let countPhysicalBetweenEightAndNineFailure = 0;
                let countInformaticsBetweenEightAndNineFailure = 0;
                let countFineBetweenEightAndNineFailure = 0;
                let countMusicBetweenEightAndNineFailure = 0;
                let countAthleticBetweenEightAndNineFailure = 0;
                let countRateBetweenEightAndNineFailure = 0;

                let countArabicLessThanEightFailure = 0;
                let countAmazighLessThanEightFailure = 0;
                let countFrenchLessThanEightFailure = 0;
                let countEnglishLessThanEightFailure = 0;
                let countIslamicLessThanEightFailure = 0;
                let countCivicsLessThanEightFailure = 0;
                let countHistoryGeographyLessThanEightFailure = 0;
                let countMathLessThanEightFailure = 0;
                let countNatureLessThanEightFailure = 0;
                let countPhysicalLessThanEightFailure = 0;
                let countInformaticsLessThanEightFailure = 0;
                let countFineLessThanEightFailure = 0;
                let countMusicLessThanEightFailure = 0;
                let countAthleticLessThanEightFailure = 0;
                let countRateLessThanEightFailure= 0;

                // Iterate over each row in the table
                table.rows().every(function () {
                    const rowData = this.data();

                    const gender = rowData['الإعادة'];

                    const arabicValue = parseFloat(rowData['اللغة العربية ف 2']) || 0;
                    const amazighValue = parseFloat(rowData['اللغة اﻷمازيغية ف 2']) || 0;
                    const frenchValue = parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
                    const englishValue = parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
                    const islamicValue = parseFloat(rowData['التربية الإسلامية ف 2']) || 0;
                    const civicsValue = parseFloat(rowData['التربية المدنية ف 2']) || 0;
                    const historyGeographyValue = parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
                    const mathValue = parseFloat(rowData['الرياضيات ف 2']) || 0;
                    const natureValue = parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
                    const physicalValue = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                    const informaticsValue = parseFloat(rowData['المعلوماتية ف 2']) || 0;
                    const fineValue = parseFloat(rowData['التربية التشكيلية ف 2']) || 0;
                    const musicValue = parseFloat(rowData['التربية الموسيقية ف 2']) || 0;
                    const athleticValue = parseFloat(rowData['ت البدنية و الرياضية ف 2']) || 0;
                    const rateValue = parseFloat(rowData['معدل الفصل 2']) || 0;

                    if (gender === "نعم" && arabicValue >= 1) {
                        sumArabicFailure += arabicValue;
                        countArabicFailure++;
                    }
                    if (gender === "نعم" && amazighValue >= 1) {
                        sumAmazighFailure += amazighValue;
                        countAmazighFailure++;
                    }
                    if (gender === "نعم" && frenchValue >= 1) {
                        sumFrenchFailure += frenchValue;
                        countFrenchFailure++;
                    }
                    if (gender === "نعم" && englishValue >= 1) {
                        sumEnglishFailure += englishValue;
                        countEnglishFailure++;
                    }
                    if (gender === "نعم" && islamicValue >= 1) {
                        sumIslamicFailure += islamicValue;
                        countIslamicFailure++;
                    }
                    if (gender === "نعم" && civicsValue >= 1) {
                        sumCivicsFailure += civicsValue;
                        countCivicsFailure++;
                    }
                    if (gender === "نعم" && historyGeographyValue >= 1) {
                        sumHistoryGeographyFailure += historyGeographyValue;
                        countHistoryGeographyFailure++;
                    }
                    if (gender === "نعم" && mathValue >= 1) {
                        sumMathFailure += mathValue;
                        countMathFailure++;
                    }
                    if (gender === "نعم" && natureValue >= 1) {
                        sumNatureFailure += natureValue;
                        countNatureFailure++;
                    }
                    if (gender === "نعم" && physicalValue >= 1) {
                        sumPhysicalFailure += physicalValue;
                        countPhysicalFailure++;
                    }
                    if (gender === "نعم" && informaticsValue >= 1) {
                        sumInformaticsFailure += informaticsValue;
                        countInformaticsFailure++;
                    }
                    if (gender === "نعم" && fineValue >= 1) {
                        sumFineFailure += fineValue;
                        countFineFailure++;
                    }
                    if (gender === "نعم" && musicValue >= 1) {
                        sumMusicFailure += musicValue;
                        countMusicFailure++;
                    }
                    if (gender === "نعم" && athleticValue >= 1) {
                        sumAthleticFailure += athleticValue;
                        countAthleticFailure++;
                    }
                    if (gender === "نعم" && rateValue >= 1) {
                        sumRateFailure += rateValue;
                        countRateFailure++;
                    }

                    // Greater than ten
                    if (gender === "نعم" && arabicValue >= 10) {
                        countArabicGTenFailure++;
                    }
                    if (gender === "نعم" && amazighValue >= 10) {
                        countAmazighGTenFailure++;
                    }
                    if (gender === "نعم" && frenchValue >= 10) {
                        countFrenchGTenFailure++;
                    }
                    if (gender === "نعم" && englishValue >= 10) {
                        countEnglishGTenFailure++;
                    }
                    if (gender === "نعم" && islamicValue >= 10) {
                        countIslamicGTenFailure++;
                    }
                    if (gender === "نعم" && civicsValue >= 10) {
                        countCivicsGTenFailure++;
                    }
                    if (gender === "نعم" && historyGeographyValue >= 10) {
                        countHistoryGeographyGTenFailure++;
                    }
                    if (gender === "نعم" && mathValue >= 10) {
                        countMathGTenFailure++;
                    }
                    if (gender === "نعم" && natureValue >= 10) {
                        countNatureGTenFailure++;
                    }
                    if (gender === "نعم" && physicalValue >= 10) {
                        countPhysicalGTenFailure++;
                    }
                    if (gender === "نعم" && informaticsValue >= 10) {
                        countInformaticsGTenFailure++;
                    }
                    if (gender === "نعم" && fineValue >= 10) {
                        countFineGTenFailure++;
                    }
                    if (gender === "نعم" && musicValue >= 10) {
                        countMusicGTenFailure++;
                    }
                    if (gender === "نعم" && athleticValue >= 10) {
                        countAthleticGTenFailure++;
                    }
                    if (gender === "نعم" && rateValue >= 10) {
                        countRateGTenFailure++;
                    }

                    // Greater or Equal 8 and Less or Equal 9.99
                    if (gender === "نعم" && arabicValue >= 8 && arabicValue <= 9.99) {
                        countArabicBetweenEightAndNineFailure++;
                    }
                    if (gender === "نعم" && amazighValue >= 8 && amazighValue <= 9.99) {
                        countAmazighBetweenEightAndNineFailure++;
                    }
                    if (gender === "نعم" && frenchValue >= 8 && frenchValue <= 9.99) {
                        countFrenchBetweenEightAndNineFailure++;
                    }
                    if (gender === "نعم" && englishValue >= 8 && englishValue <= 9.99) {
                        countEnglishBetweenEightAndNineFailure++;
                    }
                    if (gender === "نعم" && islamicValue >= 8 && islamicValue <= 9.99) {
                        countIslamicBetweenEightAndNineFailure++;
                    }
                    if (gender === "نعم" && civicsValue >= 8 && civicsValue <= 9.99) {
                        countCivicsBetweenEightAndNineFailure++;
                    }
                    if (gender === "نعم" && historyGeographyValue >= 8 && historyGeographyValue <= 9.99) {
                        countHistoryGeographyBetweenEightAndNineFailure++;
                    }
                    if (gender === "نعم" && mathValue >= 8 && mathValue <= 9.99) {
                        countMathBetweenEightAndNineFailure++;
                    }
                    if (gender === "نعم" && natureValue >= 8 && natureValue <= 9.99) {
                        countNatureBetweenEightAndNineFailure++;
                    }
                    if (gender === "نعم" && physicalValue >= 8 && physicalValue <= 9.99) {
                        countPhysicalBetweenEightAndNineFailure++;
                    }
                    if (gender === "نعم" && informaticsValue >= 8 && informaticsValue <= 9.99) {
                        countInformaticsBetweenEightAndNineFailure++;
                    }
                    if (gender === "نعم" && fineValue >= 8 && fineValue <= 9.99) {
                        countFineBetweenEightAndNineFailure++;
                    }
                    if (gender === "نعم" && musicValue >= 8 && musicValue <= 9.99) {
                        countMusicBetweenEightAndNineFailure++;
                    }
                    if (gender === "نعم" && athleticValue >= 8 && athleticValue <= 9.99) {
                        countAthleticBetweenEightAndNineFailure++;
                    }
                    if (gender === "نعم" && rateValue >= 8 && rateValue <= 9.99) {
                        countRateBetweenEightAndNineFailure++;
                    }

                    // Greater or Equal 1 and Less or Equal 8
                    if (gender === "نعم" && arabicValue >= 1 && arabicValue <= 8) {
                        countArabicLessThanEightFailure++;
                    }
                    if (gender === "نعم" && amazighValue >= 1 && amazighValue <= 8) {
                        countAmazighLessThanEightFailure++;
                    }
                    if (gender === "نعم" && frenchValue >= 1 && frenchValue <= 8) {
                        countFrenchLessThanEightFailure++;
                    }
                    if (gender === "نعم" && englishValue >= 1 && englishValue <= 8) {
                        countEnglishLessThanEightFailure++;
                    }
                    if (gender === "نعم" && islamicValue >= 1 && islamicValue <= 8) {
                        countIslamicLessThanEightFailure++;
                    }
                    if (gender === "نعم" && civicsValue >= 1 && civicsValue <= 8) {
                        countCivicsLessThanEightFailure++;
                    }
                    if (gender === "نعم" && historyGeographyValue >= 1 && historyGeographyValue <= 8) {
                        countHistoryGeographyLessThanEightFailure++;
                    }
                    if (gender === "نعم" && mathValue >= 1 && mathValue <= 8) {
                        countMathLessThanEightFailure++;
                    }
                    if (gender === "نعم" && natureValue >= 1 && natureValue <= 8) {
                        countNatureLessThanEightFailure++;
                    }
                    if (gender === "نعم" && physicalValue >= 1 && physicalValue <= 8) {
                        countPhysicalLessThanEightFailure++;
                    }
                    if (gender === "نعم" && informaticsValue >= 1 && informaticsValue <= 8) {
                        countInformaticsLessThanEightFailure++;
                    }
                    if (gender === "نعم" && fineValue >= 1 && fineValue <= 8) {
                        countFineLessThanEightFailure++;
                    }
                    if (gender === "نعم" && musicValue >= 1 && musicValue <= 8) {
                        countMusicLessThanEightFailure++;
                    }
                    if (gender === "نعم" && athleticValue >= 1 && athleticValue <= 8) {
                        countAthleticLessThanEightFailure++;
                    }
                    if (gender === "نعم" && rateValue >= 1 && rateValue <= 8) {
                        countRateLessThanEightFailure++;
                    } 
                    // Continue iteration over rows
                    return true;
                });

                // Calculate mean
                const meanArabicFailure = countArabicFailure > 0 ? sumArabicFailure / countArabicFailure : 0;
                const meanAmazighFailure = countAmazighFailure > 0 ? sumAmazighFailure / countAmazighFailure : 0;
                const meanFrenchFailure = countFrenchFailure > 0 ? sumFrenchFailure / countFrenchFailure : 0;
                const meanEnglishFailure = countEnglishFailure > 0 ? sumEnglishFailure / countEnglishFailure : 0;
                const meanIslamicFailure = countIslamicFailure > 0 ? sumIslamicFailure / countIslamicFailure : 0;
                const meanCivicsFailure = countCivicsFailure > 0 ? sumCivicsFailure / countCivicsFailure : 0;
                const meanHistoryGeographyFailure = countHistoryGeographyFailure > 0 ? sumHistoryGeographyFailure / countHistoryGeographyFailure : 0;
                const meanMathFailure = countMathFailure > 0 ? sumMathFailure / countMathFailure : 0;
                const meanNatureFailure = countNatureFailure > 0 ? sumNatureFailure / countNatureFailure : 0;
                const meanPhysicalFailure = countPhysicalFailure > 0 ? sumPhysicalFailure / countPhysicalFailure : 0;
                const meanInformaticsFailure = countInformaticsFailure > 0 ? sumInformaticsFailure / countInformaticsFailure : 0;
                const meanFineFailure = countFineFailure > 0 ? sumFineFailure / countFineFailure : 0;
                const meanMusicFailure = countMusicFailure > 0 ? sumMusicFailure / countMusicFailure : 0;
                const meanAthleticFailure = countAthleticFailure > 0 ? sumAthleticFailure / countAthleticFailure : 0;
                const meanRateFailure = countRateFailure > 0 ? sumRateFailure / countRateFailure : 0;

                // Calculate the percentage of values greater than or equal to 10 for each subject
                const percentageArabicGTenFailure = countArabicFailure !== 0 ? (countArabicGTenFailure / countArabicFailure) * 100 : 0;
                const percentageAmazighGTenFailure = countAmazighFailure !== 0 ? (countAmazighGTenFailure / countAmazighFailure) * 100 : 0;
                const percentageFrenchGTenFailure = countFrenchFailure !== 0 ? (countFrenchGTenFailure / countFrenchFailure) * 100 : 0;
                const percentageEnglishGTenFailure = countEnglishFailure !== 0 ? (countEnglishGTenFailure / countEnglishFailure) * 100 : 0;
                const percentageIslamicGTenFailure = countIslamicFailure !== 0 ? (countIslamicGTenFailure / countIslamicFailure) * 100 : 0;
                const percentageCivicsGTenFailure = countCivicsFailure !== 0 ? (countCivicsGTenFailure / countCivicsFailure) * 100 : 0;
                const percentageHistoryAndGeographyGTenFailure = countHistoryGeographyGTenFailure !== 0 ? (countHistoryGeographyGTenFailure / countHistoryGeographyFailure) * 100 : 0;
                const percentageMathGTenFailure = countMathFailure !== 0 ? (countMathGTenFailure / countMathFailure) * 100 : 0;
                const percentageNatureGTenFailure = countNatureFailure !== 0 ? (countNatureGTenFailure / countNatureFailure) * 100 : 0;
                const percentagePhysicalGTenFailure = countPhysicalFailure !== 0 ? (countPhysicalGTenFailure / countPhysicalFailure) * 100 : 0;
                const percentageInformaticsGTenFailure = countInformaticsFailure !== 0 ? (countInformaticsGTenFailure / countInformaticsFailure) * 100 : 0;
                const percentageFineGTenFailure = countFineFailure !== 0 ? (countFineGTenFailure / countFineFailure) * 100 : 0;
                const percentageMusicGTenFailure = countMusicFailure !== 0 ? (countMusicGTenFailure / countMusicFailure) * 100 : 0;
                const percentageAthleticGTenFailure = countAthleticFailure !== 0 ? (countAthleticGTenFailure / countAthleticFailure) * 100 : 0;
                const percentageRateGTenFailure = countRateFailure !== 0 ? (countRateGTenFailure / countRateFailure) * 100 : 0;

                // Calculate the percentage of values greater than or equal to 8 less than or equal to 9.99 for each subject
                const percentageArabicBetweenEightAndNineFailure = countArabicFailure !== 0 ? (countArabicBetweenEightAndNineFailure / countArabicFailure) * 100 : 0;
                const percentageAmazighBetweenEightAndNineFailure = countAmazighFailure !== 0 ? (countAmazighBetweenEightAndNineFailure / countAmazighFailure) * 100 : 0;
                const percentageFrenchBetweenEightAndNineFailure = countFrenchFailure !== 0 ? (countFrenchBetweenEightAndNineFailure / countFrenchFailure) * 100 : 0;
                const percentageEnglishBetweenEightAndNineFailure = countEnglishFailure !== 0 ? (countEnglishBetweenEightAndNineFailure / countEnglishFailure) * 100 : 0;
                const percentageIslamicBetweenEightAndNineFailure = countIslamicFailure !== 0 ? (countIslamicBetweenEightAndNineFailure / countIslamicFailure) * 100 : 0;
                const percentageCivicsBetweenEightAndNineFailure = countCivicsFailure !== 0 ? (countCivicsBetweenEightAndNineFailure / countCivicsFailure) * 100 : 0;
                const percentageHistoryAndGeographyBetweenEightAndNineFailure = countHistoryGeographyFailure !== 0 ? (countHistoryGeographyBetweenEightAndNineFailure / countHistoryGeographyFailure) * 100 : 0;
                const percentageMathBetweenEightAndNineFailure = countMathFailure !== 0 ? (countMathBetweenEightAndNineFailure / countMathFailure) * 100 : 0;
                const percentageNatureBetweenEightAndNineFailure = countNatureFailure !== 0 ? (countNatureBetweenEightAndNineFailure / countNatureFailure) * 100 : 0;
                const percentagePhysicalBetweenEightAndNineFailure = countPhysicalFailure !== 0 ? (countPhysicalBetweenEightAndNineFailure / countPhysicalFailure) * 100 : 0;
                const percentageInformaticsBetweenEightAndNineFailure = countInformaticsFailure !== 0 ? (countInformaticsBetweenEightAndNineFailure / countInformaticsFailure) * 100 : 0;
                const percentageFineBetweenEightAndNineFailure = countFineFailure !== 0 ? (countFineBetweenEightAndNineFailure / countFineFailure) * 100 : 0;
                const percentageMusicBetweenEightAndNineFailure = countMusicFailure !== 0 ? (countMusicBetweenEightAndNineFailure / countMusicFailure) * 100 : 0;
                const percentageAthleticBetweenEightAndNineFailure = countAthleticFailure !== 0 ? (countAthleticBetweenEightAndNineFailure / countAthleticFailure) * 100 : 0;
                const percentageRateBetweenEightAndNineFailure = countRateFailure !== 0 ? (countRateBetweenEightAndNineFailure / countRateFailure) * 100 : 0;

                // Calculate the percentage of values greater than or equal to 1 less than or equal to 8 for each subject
                const percentageArabicLessThanEightFailure = countArabicFailure !== 0 ? (countArabicLessThanEightFailure / countArabicFailure) * 100 : 0;
                const percentageAmazighLessThanEightFailure = countAmazighFailure !== 0 ? (countAmazighLessThanEightFailure / countAmazighFailure) * 100 : 0;
                const percentageFrenchLessThanEightFailure = countFrenchFailure !== 0 ? (countFrenchLessThanEightFailure / countFrenchFailure) * 100 : 0;
                const percentageEnglishLessThanEightFailure = countEnglishFailure !== 0 ? (countEnglishLessThanEightFailure / countEnglishFailure) * 100 : 0;
                const percentageIslamicLessThanEightFailure = countIslamicFailure !== 0 ? (countIslamicLessThanEightFailure / countIslamicFailure) * 100 : 0;
                const percentageCivicsLessThanEightFailure = countCivicsFailure !== 0 ? (countCivicsLessThanEightFailure / countCivicsFailure) * 100 : 0;
                const percentageHistoryAndGeographyLessThanEightFailure = countHistoryGeographyFailure !== 0 ? (countHistoryGeographyLessThanEightFailure / countHistoryGeographyFailure) * 100 : 0;
                const percentageMathLessThanEightFailure = countMathFailure !== 0 ? (countMathLessThanEightFailure / countMathFailure) * 100 : 0;
                const percentageNatureLessThanEightFailure = countNatureFailure !== 0 ? (countNatureLessThanEightFailure / countNatureFailure) * 100 : 0;
                const percentagePhysicalLessThanEightFailure = countPhysicalFailure !== 0 ? (countPhysicalLessThanEightFailure / countPhysicalFailure) * 100 : 0;
                const percentageInformaticsLessThanEightFailure = countInformaticsFailure !== 0 ? (countInformaticsLessThanEightFailure / countInformaticsFailure) * 100 : 0;
                const percentageFineLessThanEightFailure = countFineFailure !== 0 ? (countFineLessThanEightFailure / countFineFailure) * 100 : 0;
                const percentageMusicLessThanEightFailure = countMusicFailure !== 0 ? (countMusicLessThanEightFailure / countMusicFailure) * 100 : 0;
                const percentageAthleticLessThanEightFailure = countAthleticFailure !== 0 ? (countAthleticLessThanEightFailure / countAthleticFailure) * 100 : 0;
                const percentageRateLessThanEightFailure = countRateFailure !== 0 ? (countRateLessThanEightFailure / countRateFailure) * 100 : 0;
                    
                // Update the HTML elements with the means for each subject
                $('#arabic-meanFailure').text(meanArabicFailure.toFixed(2));
                $('#amazigh-meanFailure').text(meanAmazighFailure.toFixed(2));
                $('#french-meanFailure').text(meanFrenchFailure.toFixed(2));
                $('#english-meanFailure').text(meanEnglishFailure.toFixed(2));
                $('#islamic-meanFailure').text(meanIslamicFailure.toFixed(2));
                $('#civics-meanFailure').text(meanCivicsFailure.toFixed(2));
                $('#historyandgeography-meanFailure').text(meanHistoryGeographyFailure.toFixed(2));
                $('#math-meanFailure').text(meanMathFailure.toFixed(2));
                $('#nature-meanFailure').text(meanNatureFailure.toFixed(2));
                $('#physical-meanFailure').text(meanPhysicalFailure.toFixed(2));
                $('#informatics-meanFailure').text(meanInformaticsFailure.toFixed(2));
                $('#fine-meanFailure').text(meanFineFailure.toFixed(2));
                $('#music-meanFailure').text(meanMusicFailure.toFixed(2));
                $('#athletic-meanFailure').text(meanAthleticFailure.toFixed(2));
                $('#rate-meanFailure').text(meanRateFailure.toFixed(2));

                // Add badge dynamically based on mean value
                addBadgeFailure('#arabic-meanFailure', meanArabicFailure);
                addBadgeFailure('#amazigh-meanFailure', meanAmazighFailure);
                addBadgeFailure('#french-meanFailure', meanFrenchFailure);
                addBadgeFailure('#english-meanFailure', meanEnglishFailure);
                addBadgeFailure('#islamic-meanFailure', meanIslamicFailure);
                addBadgeFailure('#civics-meanFailure', meanCivicsFailure);
                addBadgeFailure('#historyandgeography-meanFailure', meanHistoryGeographyFailure);
                addBadgeFailure('#math-meanFailure', meanMathFailure);
                addBadgeFailure('#nature-meanFailure', meanNatureFailure);
                addBadgeFailure('#physical-meanFailure', meanPhysicalFailure);
                addBadgeFailure('#informatics-meanFailure', meanInformaticsFailure);
                addBadgeFailure('#fine-meanFailure', meanFineFailure);
                addBadgeFailure('#music-meanFailure', meanMusicFailure);
                addBadgeFailure('#athletic-meanFailure', meanAthleticFailure);
                addBadgeFailure('#rate-meanFailure', meanRateFailure);

                function addBadgeFailure(selectorFailure, Failure) {
                    if (Failure >=1 && Failure < 10) {
                        $(selectorFailure).append('<span class="badge-1" title="تحصل التلاميذ على معدل أو نسبة تقل عن المتوسط">ضعيف</span>');
                    }
                }

                // Update the HTML elements with the means for each subject
                $('#arabic-countGTenFailure').text(countArabicGTenFailure);
                $('#amazigh-countGTenFailure').text(countAmazighGTenFailure);
                $('#french-countGTenFailure').text(countFrenchGTenFailure);
                $('#english-countGTenFailure').text(countEnglishGTenFailure);
                $('#islamic-countGTenFailure').text(countIslamicGTenFailure);
                $('#civics-countGTenFailure').text(countCivicsGTenFailure);
                $('#historyandgeography-countGTenFailure').text(countHistoryGeographyGTenFailure);
                $('#math-countGTenFailure').text(countMathGTenFailure);
                $('#nature-countGTenFailure').text(countNatureGTenFailure);
                $('#physical-countGTenFailure').text(countPhysicalGTenFailure);
                $('#informatics-countGTenFailure').text(countInformaticsGTenFailure);
                $('#fine-countGTenFailure').text(countFineGTenFailure);
                $('#music-countGTenFailure').text(countMusicGTenFailure);
                $('#athletic-countGTenFailure').text(countAthleticGTenFailure);
                $('#rate-countGTenFailure').text(countRateGTenFailure);

                // Update the HTML elements with the means for each subject
                $('#arabic-percentageGTenFailure').text(percentageArabicGTenFailure.toFixed(2) + "%");
                $('#amazigh-percentageGTenFailure').text(percentageAmazighGTenFailure.toFixed(2) + "%");
                $('#french-percentageGTenFailure').text(percentageFrenchGTenFailure.toFixed(2) + "%");
                $('#english-percentageGTenFailure').text(percentageEnglishGTenFailure.toFixed(2) + "%");
                $('#islamic-percentageGTenFailure').text(percentageIslamicGTenFailure.toFixed(2) + "%");
                $('#civics-percentageGTenFailure').text(percentageCivicsGTenFailure.toFixed(2) + "%");
                $('#historyandgeography-percentageGTenFailure').text(percentageHistoryAndGeographyGTenFailure.toFixed(2) + "%");
                $('#math-percentageGTenFailure').text(percentageMathGTenFailure.toFixed(2) + "%");
                $('#nature-percentageGTenFailure').text(percentageNatureGTenFailure.toFixed(2) + "%");
                $('#physical-percentageGTenFailure').text(percentagePhysicalGTenFailure.toFixed(2) + "%");
                $('#informatics-percentageGTenFailure').text(percentageInformaticsGTenFailure.toFixed(2) + "%");
                $('#fine-percentageGTenFailure').text(percentageFineGTenFailure.toFixed(2) + "%");
                $('#music-percentageGTenFailure').text(percentageMusicGTenFailure.toFixed(2) + "%");
                $('#athletic-percentageGTenFailure').text(percentageAthleticGTenFailure.toFixed(2) + "%");
                $('#rate-percentageGTenFailure').text(percentageRateGTenFailure.toFixed(2) + "%");

                // Update the HTML elements with the means for each subject
                $('#arabic-countBEightAndNineFailure').text(countArabicBetweenEightAndNineFailure);
                $('#amazigh-countBEightAndNineFailure').text(countAmazighBetweenEightAndNineFailure);
                $('#french-countBEightAndNineFailure').text(countFrenchBetweenEightAndNineFailure);
                $('#english-countBEightAndNineFailure').text(countEnglishBetweenEightAndNineFailure);
                $('#islamic-countBEightAndNineFailure').text(countIslamicBetweenEightAndNineFailure);
                $('#civics-countBEightAndNineFailure').text(countCivicsBetweenEightAndNineFailure);
                $('#historyandgeography-countBEightAndNineFailure').text(countHistoryGeographyBetweenEightAndNineFailure);
                $('#math-countBEightAndNineFailure').text(countMathBetweenEightAndNineFailure);
                $('#nature-countBEightAndNineFailure').text(countNatureBetweenEightAndNineFailure);
                $('#physical-countBEightAndNineFailure').text(countPhysicalBetweenEightAndNineFailure);
                $('#informatics-countBEightAndNineFailure').text(countInformaticsBetweenEightAndNineFailure);
                $('#fine-countBEightAndNineFailure').text(countFineBetweenEightAndNineFailure);
                $('#music-countBEightAndNineFailure').text(countMusicBetweenEightAndNineFailure);
                $('#athletic-countBEightAndNineFailure').text(countAthleticBetweenEightAndNineFailure);
                $('#rate-countBEightAndNineFailure').text(countRateBetweenEightAndNineFailure);

                // Update the HTML elements with the means for each subject
                $('#arabic-percentageBEightAndNineFailure').text(percentageArabicBetweenEightAndNineFailure.toFixed(2) + "%");
                $('#amazigh-percentageBEightAndNineFailure').text(percentageAmazighBetweenEightAndNineFailure.toFixed(2) + "%");
                $('#french-percentageBEightAndNineFailure').text(percentageFrenchBetweenEightAndNineFailure.toFixed(2) + "%");
                $('#english-percentageBEightAndNineFailure').text(percentageEnglishBetweenEightAndNineFailure.toFixed(2) + "%");
                $('#islamic-percentageBEightAndNineFailure').text(percentageIslamicBetweenEightAndNineFailure.toFixed(2) + "%");
                $('#civics-percentageBEightAndNineFailure').text(percentageCivicsBetweenEightAndNineFailure.toFixed(2) + "%");
                $('#historyandgeography-percentageBEightAndNineFailure').text(percentageHistoryAndGeographyBetweenEightAndNineFailure.toFixed(2) + "%");
                $('#math-percentageBEightAndNineFailure').text(percentageMathBetweenEightAndNineFailure.toFixed(2) + "%");
                $('#nature-percentageBEightAndNineFailure').text(percentageNatureBetweenEightAndNineFailure.toFixed(2) + "%");
                $('#physical-percentageBEightAndNineFailure').text(percentagePhysicalBetweenEightAndNineFailure.toFixed(2) + "%");
                $('#informatics-percentageBEightAndNineFailure').text(percentageInformaticsBetweenEightAndNineFailure.toFixed(2) + "%");
                $('#fine-percentageBEightAndNineFailure').text(percentageFineBetweenEightAndNineFailure.toFixed(2) + "%");
                $('#music-percentageBEightAndNineFailure').text(percentageMusicBetweenEightAndNineFailure.toFixed(2) + "%");
                $('#athletic-percentageBEightAndNineFailure').text(percentageAthleticBetweenEightAndNineFailure.toFixed(2) + "%");
                $('#rate-percentageBEightAndNineFailure').text(percentageRateBetweenEightAndNineFailure.toFixed(2) + "%");

                // Update the HTML elements with the means for each subject
                $('#arabic-countLEightFailure').text(countArabicLessThanEightFailure);
                $('#amazigh-countLEightFailure').text(countAmazighLessThanEightFailure);
                $('#french-countLEightFailure').text(countFrenchLessThanEightFailure);
                $('#english-countLEightFailure').text(countEnglishLessThanEightFailure);
                $('#islamic-countLEightFailure').text(countIslamicLessThanEightFailure);
                $('#civics-countLEightFailure').text(countCivicsLessThanEightFailure);
                $('#historyandgeography-countLEightFailure').text(countHistoryGeographyLessThanEightFailure);
                $('#math-countLEightFailure').text(countMathLessThanEightFailure);
                $('#nature-countLEightFailure').text(countNatureLessThanEightFailure);
                $('#physical-countLEightFailure').text(countPhysicalLessThanEightFailure);
                $('#informatics-countLEightFailure').text(countInformaticsLessThanEightFailure);
                $('#fine-countLEightFailure').text(countFineLessThanEightFailure);
                $('#music-countLEightFailure').text(countMusicLessThanEightFailure);
                $('#athletic-countLEightFailure').text(countAthleticLessThanEightFailure);
                $('#rate-countLEightFailure').text(countRateLessThanEightFailure);

                // Update the HTML elements with the means for each subject
                $('#arabic-percentageLEightFailure').text(percentageArabicLessThanEightFailure.toFixed(2) + "%");
                $('#amazigh-percentageLEightFailure').text(percentageAmazighLessThanEightFailure.toFixed(2) + "%");
                $('#french-percentageLEightFailure').text(percentageFrenchLessThanEightFailure.toFixed(2) + "%");
                $('#english-percentageLEightFailure').text(percentageEnglishLessThanEightFailure.toFixed(2) + "%");
                $('#islamic-percentageLEightFailure').text(percentageIslamicLessThanEightFailure.toFixed(2) + "%");
                $('#civics-percentageLEightFailure').text(percentageCivicsLessThanEightFailure.toFixed(2) + "%");
                $('#historyandgeography-percentageLEightFailure').text(percentageHistoryAndGeographyLessThanEightFailure.toFixed(2) + "%");
                $('#math-percentageLEightFailure').text(percentageMathLessThanEightFailure.toFixed(2) + "%");
                $('#nature-percentageLEightFailure').text(percentageNatureLessThanEightFailure.toFixed(2) + "%");
                $('#physical-percentageLEightFailure').text(percentagePhysicalLessThanEightFailure.toFixed(2) + "%");
                $('#informatics-percentageLEightFailure').text(percentageInformaticsLessThanEightFailure.toFixed(2) + "%");
                $('#fine-percentageLEightFailure').text(percentageFineLessThanEightFailure.toFixed(2) + "%");
                $('#music-percentageLEightFailure').text(percentageMusicLessThanEightFailure.toFixed(2) + "%");
                $('#athletic-percentageLEightFailure').text(percentageAthleticLessThanEightFailure.toFixed(2) + "%");
                $('#rate-percentageLEightFailure').text(percentageRateLessThanEightFailure.toFixed(2) + "%");

                // Calculate Successful DataTable for Successful
                // Initialize counters for each subject
                let countarabicSuccessful = 0;
                let countamazighSuccessful = 0;
                let countfrenchSuccessful = 0;
                let countenglishSuccessful = 0;
                let countislamicSuccessful = 0;
                let countcivicsSuccessful = 0;
                let counthistoryandgeographySuccessful = 0;
                let countmathSuccessful = 0;
                let countnatureSuccessful = 0;
                let countphysicalSuccessful = 0;
                let countinformaticsSuccessful = 0;
                let countfineSuccessful = 0;
                let countmusicSuccessful = 0;
                let countathleticSuccessful = 0;
                let countrateSuccessful = 0;

                // Iterate over each row in the table
                table.rows().every(function() {
                    const rowData = this.data();

                    // Check each subject for values greater than or equal to 1
                    const gender = rowData['الإعادة'];

                    const arabicValue = parseFloat(rowData['اللغة العربية ف 2']) || 0;
                    const amazighValue = parseFloat(rowData['اللغة اﻷمازيغية ف 2']) || 0;
                    const frenchValue = parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
                    const englishValue = parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
                    const islamicValue = parseFloat(rowData['التربية الإسلامية ف 2']) || 0;
                    const civicsValue = parseFloat(rowData['التربية المدنية ف 2']) || 0;
                    const historyandgeographyValue = parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
                    const mathValue = parseFloat(rowData['الرياضيات ف 2']) || 0;
                    const natureValue = parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
                    const physicalValue = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                    const informaticsValue = parseFloat(rowData['المعلوماتية ف 2']) || 0;
                    const fineValue = parseFloat(rowData['التربية التشكيلية ف 2']) || 0;
                    const musicValue = parseFloat(rowData['التربية الموسيقية ف 2']) || 0;
                    const athleticValue = parseFloat(rowData['ت البدنية و الرياضية ف 2']) || 0;
                    const rateValue = parseFloat(rowData['معدل الفصل 2']) || 0;

                   
                    if (gender === "لا" && arabicValue >= 1) {
                        countarabicSuccessful++;
                    }
                    if (gender === "لا" && amazighValue >= 1) {
                        countamazighSuccessful++;
                    }
                    if (gender === "لا" && frenchValue >= 1) {
                        countfrenchSuccessful++;
                    }
                    if (gender === "لا" && englishValue >= 1) {
                        countenglishSuccessful++;
                    }
                    if (gender === "لا" && islamicValue >= 1) {
                        countislamicSuccessful++;
                    }
                    if (gender === "لا" && civicsValue >= 1) {
                        countcivicsSuccessful++;
                    }
                    if (gender === "لا" && historyandgeographyValue >= 1) {
                        counthistoryandgeographySuccessful++;
                    }
                    if (gender === "لا" && mathValue >= 1) {
                        countmathSuccessful++;
                    }
                    if (gender === "لا" && natureValue >= 1) {
                        countnatureSuccessful++;
                    }
                    if (gender === "لا" && physicalValue >= 1) {
                        countphysicalSuccessful++;
                    }
                    if (gender === "لا" && informaticsValue >= 1) {
                        countinformaticsSuccessful++;
                    }
                    if (gender === "لا" && fineValue >= 1) {
                        countfineSuccessful++;
                    }
                    if (gender === "لا" && musicValue >= 1) {
                        countmusicSuccessful++;
                    }
                    if (gender === "لا" && athleticValue >= 1) {
                        countathleticSuccessful++;
                    }
                    if (gender === "لا" && rateValue >= 1) {
                        countrateSuccessful++;
                    }

                    // Continue iteration over rows
                    return true;
                });

                // Update the HTML elements with the counts for each subject
                $('#arabic-countSuccessful').text(countarabicSuccessful);
                $('#amazigh-countSuccessful').text(countamazighSuccessful);
                $('#french-countSuccessful').text(countfrenchSuccessful);
                $('#english-countSuccessful').text(countenglishSuccessful);
                $('#islamic-countSuccessful').text(countislamicSuccessful);
                $('#civics-countSuccessful').text(countcivicsSuccessful);
                $('#historyandgeography-countSuccessful').text(counthistoryandgeographySuccessful);
                $('#math-countSuccessful').text(countmathSuccessful);
                $('#nature-countSuccessful').text(countnatureSuccessful);
                $('#physical-countSuccessful').text(countphysicalSuccessful);
                $('#informatics-countSuccessful').text(countinformaticsSuccessful);
                $('#fine-countSuccessful').text(countfineSuccessful);
                $('#music-countSuccessful').text(countmusicSuccessful);
                $('#athletic-countSuccessful').text(countathleticSuccessful);
                $('#rate-countSuccessful').text(countrateSuccessful);


                // Initialize variables for sum and count
                let sumArabicSuccessful = 0;
                let sumAmazighSuccessful = 0;
                let sumFrenchSuccessful = 0;
                let sumEnglishSuccessful = 0;
                let sumIslamicSuccessful = 0;
                let sumCivicsSuccessful = 0;
                let sumHistoryGeographySuccessful = 0;
                let sumMathSuccessful = 0;
                let sumNatureSuccessful = 0;
                let sumPhysicalSuccessful = 0;
                let sumInformaticsSuccessful = 0;
                let sumFineSuccessful = 0;
                let sumMusicSuccessful = 0;
                let sumAthleticSuccessful = 0;
                let sumRateSuccessful = 0;

                let countArabicSuccessful = 0;
                let countAmazighSuccessful = 0;
                let countFrenchSuccessful = 0;
                let countEnglishSuccessful = 0;
                let countIslamicSuccessful = 0;
                let countCivicsSuccessful = 0;
                let countHistoryGeographySuccessful = 0;
                let countMathSuccessful = 0;
                let countNatureSuccessful = 0;
                let countPhysicalSuccessful = 0;
                let countInformaticsSuccessful = 0;
                let countFineSuccessful = 0;
                let countMusicSuccessful = 0;
                let countAthleticSuccessful = 0;
                let countRateSuccessful = 0;

                let countArabicGTenSuccessful = 0;
                let countAmazighGTenSuccessful = 0;
                let countFrenchGTenSuccessful = 0;
                let countEnglishGTenSuccessful = 0;
                let countIslamicGTenSuccessful = 0;
                let countCivicsGTenSuccessful = 0;
                let countHistoryGeographyGTenSuccessful = 0;
                let countMathGTenSuccessful = 0;
                let countNatureGTenSuccessful = 0;
                let countPhysicalGTenSuccessful = 0;
                let countInformaticsGTenSuccessful = 0;
                let countFineGTenSuccessful = 0;
                let countMusicGTenSuccessful = 0;
                let countAthleticGTenSuccessful = 0;
                let countRateGTenSuccessful = 0;

                let countArabicBetweenEightAndNineSuccessful = 0;
                let countAmazighBetweenEightAndNineSuccessful = 0;
                let countFrenchBetweenEightAndNineSuccessful = 0;
                let countEnglishBetweenEightAndNineSuccessful = 0;
                let countIslamicBetweenEightAndNineSuccessful = 0;
                let countCivicsBetweenEightAndNineSuccessful = 0;
                let countHistoryGeographyBetweenEightAndNineSuccessful = 0;
                let countMathBetweenEightAndNineSuccessful = 0;
                let countNatureBetweenEightAndNineSuccessful = 0;
                let countPhysicalBetweenEightAndNineSuccessful = 0;
                let countInformaticsBetweenEightAndNineSuccessful = 0;
                let countFineBetweenEightAndNineSuccessful = 0;
                let countMusicBetweenEightAndNineSuccessful = 0;
                let countAthleticBetweenEightAndNineSuccessful = 0;
                let countRateBetweenEightAndNineSuccessful = 0;

                let countArabicLessThanEightSuccessful = 0;
                let countAmazighLessThanEightSuccessful = 0;
                let countFrenchLessThanEightSuccessful = 0;
                let countEnglishLessThanEightSuccessful = 0;
                let countIslamicLessThanEightSuccessful = 0;
                let countCivicsLessThanEightSuccessful = 0;
                let countHistoryGeographyLessThanEightSuccessful = 0;
                let countMathLessThanEightSuccessful = 0;
                let countNatureLessThanEightSuccessful = 0;
                let countPhysicalLessThanEightSuccessful = 0;
                let countInformaticsLessThanEightSuccessful = 0;
                let countFineLessThanEightSuccessful = 0;
                let countMusicLessThanEightSuccessful = 0;
                let countAthleticLessThanEightSuccessful = 0;
                let countRateLessThanEightSuccessful= 0;

                // Iterate over each row in the table
                table.rows().every(function () {
                    const rowData = this.data();

                    const gender = rowData['الإعادة'];

                    const arabicValue = parseFloat(rowData['اللغة العربية ف 2']) || 0;
                    const amazighValue = parseFloat(rowData['اللغة اﻷمازيغية ف 2']) || 0;
                    const frenchValue = parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
                    const englishValue = parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
                    const islamicValue = parseFloat(rowData['التربية الإسلامية ف 2']) || 0;
                    const civicsValue = parseFloat(rowData['التربية المدنية ف 2']) || 0;
                    const historyGeographyValue = parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
                    const mathValue = parseFloat(rowData['الرياضيات ف 2']) || 0;
                    const natureValue = parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
                    const physicalValue = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                    const informaticsValue = parseFloat(rowData['المعلوماتية ف 2']) || 0;
                    const fineValue = parseFloat(rowData['التربية التشكيلية ف 2']) || 0;
                    const musicValue = parseFloat(rowData['التربية الموسيقية ف 2']) || 0;
                    const athleticValue = parseFloat(rowData['ت البدنية و الرياضية ف 2']) || 0;
                    const rateValue = parseFloat(rowData['معدل الفصل 2']) || 0;

                    if (gender === "لا" && arabicValue >= 1) {
                        sumArabicSuccessful += arabicValue;
                        countArabicSuccessful++;
                    }
                    if (gender === "لا" && amazighValue >= 1) {
                        sumAmazighSuccessful += amazighValue;
                        countAmazighSuccessful++;
                    }
                    if (gender === "لا" && frenchValue >= 1) {
                        sumFrenchSuccessful += frenchValue;
                        countFrenchSuccessful++;
                    }
                    if (gender === "لا" && englishValue >= 1) {
                        sumEnglishSuccessful += englishValue;
                        countEnglishSuccessful++;
                    }
                    if (gender === "لا" && islamicValue >= 1) {
                        sumIslamicSuccessful += islamicValue;
                        countIslamicSuccessful++;
                    }
                    if (gender === "لا" && civicsValue >= 1) {
                        sumCivicsSuccessful += civicsValue;
                        countCivicsSuccessful++;
                    }
                    if (gender === "لا" && historyGeographyValue >= 1) {
                        sumHistoryGeographySuccessful += historyGeographyValue;
                        countHistoryGeographySuccessful++;
                    }
                    if (gender === "لا" && mathValue >= 1) {
                        sumMathSuccessful += mathValue;
                        countMathSuccessful++;
                    }
                    if (gender === "لا" && natureValue >= 1) {
                        sumNatureSuccessful += natureValue;
                        countNatureSuccessful++;
                    }
                    if (gender === "لا" && physicalValue >= 1) {
                        sumPhysicalSuccessful += physicalValue;
                        countPhysicalSuccessful++;
                    }
                    if (gender === "لا" && informaticsValue >= 1) {
                        sumInformaticsSuccessful += informaticsValue;
                        countInformaticsSuccessful++;
                    }
                    if (gender === "لا" && fineValue >= 1) {
                        sumFineSuccessful += fineValue;
                        countFineSuccessful++;
                    }
                    if (gender === "لا" && musicValue >= 1) {
                        sumMusicSuccessful += musicValue;
                        countMusicSuccessful++;
                    }
                    if (gender === "لا" && athleticValue >= 1) {
                        sumAthleticSuccessful += athleticValue;
                        countAthleticSuccessful++;
                    }
                    if (gender === "لا" && rateValue >= 1) {
                        sumRateSuccessful += rateValue;
                        countRateSuccessful++;
                    }

                    // Greater than ten
                    if (gender === "لا" && arabicValue >= 10) {
                        countArabicGTenSuccessful++;
                    }
                    if (gender === "لا" && amazighValue >= 10) {
                        countAmazighGTenSuccessful++;
                    }
                    if (gender === "لا" && frenchValue >= 10) {
                        countFrenchGTenSuccessful++;
                    }
                    if (gender === "لا" && englishValue >= 10) {
                        countEnglishGTenSuccessful++;
                    }
                    if (gender === "لا" && islamicValue >= 10) {
                        countIslamicGTenSuccessful++;
                    }
                    if (gender === "لا" && civicsValue >= 10) {
                        countCivicsGTenSuccessful++;
                    }
                    if (gender === "لا" && historyGeographyValue >= 10) {
                        countHistoryGeographyGTenSuccessful++;
                    }
                    if (gender === "لا" && mathValue >= 10) {
                        countMathGTenSuccessful++;
                    }
                    if (gender === "لا" && natureValue >= 10) {
                        countNatureGTenSuccessful++;
                    }
                    if (gender === "لا" && physicalValue >= 10) {
                        countPhysicalGTenSuccessful++;
                    }
                    if (gender === "لا" && informaticsValue >= 10) {
                        countInformaticsGTenSuccessful++;
                    }
                    if (gender === "لا" && fineValue >= 10) {
                        countFineGTenSuccessful++;
                    }
                    if (gender === "لا" && musicValue >= 10) {
                        countMusicGTenSuccessful++;
                    }
                    if (gender === "لا" && athleticValue >= 10) {
                        countAthleticGTenSuccessful++;
                    }
                    if (gender === "لا" && rateValue >= 10) {
                        countRateGTenSuccessful++;
                    }

                    // Greater or Equal 8 and Less or Equal 9.99
                    if (gender === "لا" && arabicValue >= 8 && arabicValue <= 9.99) {
                        countArabicBetweenEightAndNineSuccessful++;
                    }
                    if (gender === "لا" && amazighValue >= 8 && amazighValue <= 9.99) {
                        countAmazighBetweenEightAndNineSuccessful++;
                    }
                    if (gender === "لا" && frenchValue >= 8 && frenchValue <= 9.99) {
                        countFrenchBetweenEightAndNineSuccessful++;
                    }
                    if (gender === "لا" && englishValue >= 8 && englishValue <= 9.99) {
                        countEnglishBetweenEightAndNineSuccessful++;
                    }
                    if (gender === "لا" && islamicValue >= 8 && islamicValue <= 9.99) {
                        countIslamicBetweenEightAndNineSuccessful++;
                    }
                    if (gender === "لا" && civicsValue >= 8 && civicsValue <= 9.99) {
                        countCivicsBetweenEightAndNineSuccessful++;
                    }
                    if (gender === "لا" && historyGeographyValue >= 8 && historyGeographyValue <= 9.99) {
                        countHistoryGeographyBetweenEightAndNineSuccessful++;
                    }
                    if (gender === "لا" && mathValue >= 8 && mathValue <= 9.99) {
                        countMathBetweenEightAndNineSuccessful++;
                    }
                    if (gender === "لا" && natureValue >= 8 && natureValue <= 9.99) {
                        countNatureBetweenEightAndNineSuccessful++;
                    }
                    if (gender === "لا" && physicalValue >= 8 && physicalValue <= 9.99) {
                        countPhysicalBetweenEightAndNineSuccessful++;
                    }
                    if (gender === "لا" && informaticsValue >= 8 && informaticsValue <= 9.99) {
                        countInformaticsBetweenEightAndNineSuccessful++;
                    }
                    if (gender === "لا" && fineValue >= 8 && fineValue <= 9.99) {
                        countFineBetweenEightAndNineSuccessful++;
                    }
                    if (gender === "لا" && musicValue >= 8 && musicValue <= 9.99) {
                        countMusicBetweenEightAndNineSuccessful++;
                    }
                    if (gender === "لا" && athleticValue >= 8 && athleticValue <= 9.99) {
                        countAthleticBetweenEightAndNineSuccessful++;
                    }
                    if (gender === "لا" && rateValue >= 8 && rateValue <= 9.99) {
                        countRateBetweenEightAndNineSuccessful++;
                    }

                    // Greater or Equal 1 and Less or Equal 8
                    if (gender === "لا" && arabicValue >= 1 && arabicValue <= 8) {
                        countArabicLessThanEightSuccessful++;
                    }
                    if (gender === "لا" && amazighValue >= 1 && amazighValue <= 8) {
                        countAmazighLessThanEightSuccessful++;
                    }
                    if (gender === "لا" && frenchValue >= 1 && frenchValue <= 8) {
                        countFrenchLessThanEightSuccessful++;
                    }
                    if (gender === "لا" && englishValue >= 1 && englishValue <= 8) {
                        countEnglishLessThanEightSuccessful++;
                    }
                    if (gender === "لا" && islamicValue >= 1 && islamicValue <= 8) {
                        countIslamicLessThanEightSuccessful++;
                    }
                    if (gender === "لا" && civicsValue >= 1 && civicsValue <= 8) {
                        countCivicsLessThanEightSuccessful++;
                    }
                    if (gender === "لا" && historyGeographyValue >= 1 && historyGeographyValue <= 8) {
                        countHistoryGeographyLessThanEightSuccessful++;
                    }
                    if (gender === "لا" && mathValue >= 1 && mathValue <= 8) {
                        countMathLessThanEightSuccessful++;
                    }
                    if (gender === "لا" && natureValue >= 1 && natureValue <= 8) {
                        countNatureLessThanEightSuccessful++;
                    }
                    if (gender === "لا" && physicalValue >= 1 && physicalValue <= 8) {
                        countPhysicalLessThanEightSuccessful++;
                    }
                    if (gender === "لا" && informaticsValue >= 1 && informaticsValue <= 8) {
                        countInformaticsLessThanEightSuccessful++;
                    }
                    if (gender === "لا" && fineValue >= 1 && fineValue <= 8) {
                        countFineLessThanEightSuccessful++;
                    }
                    if (gender === "لا" && musicValue >= 1 && musicValue <= 8) {
                        countMusicLessThanEightSuccessful++;
                    }
                    if (gender === "لا" && athleticValue >= 1 && athleticValue <= 8) {
                        countAthleticLessThanEightSuccessful++;
                    }
                    if (gender === "لا" && rateValue >= 1 && rateValue <= 8) {
                        countRateLessThanEightSuccessful++;
                    } 
                    // Continue iteration over rows
                    return true;
                });

                // Calculate mean
                const meanArabicSuccessful = countArabicSuccessful > 0 ? sumArabicSuccessful / countArabicSuccessful : 0;
                const meanAmazighSuccessful = countAmazighSuccessful > 0 ? sumAmazighSuccessful / countAmazighSuccessful : 0;
                const meanFrenchSuccessful = countFrenchSuccessful > 0 ? sumFrenchSuccessful / countFrenchSuccessful : 0;
                const meanEnglishSuccessful = countEnglishSuccessful > 0 ? sumEnglishSuccessful / countEnglishSuccessful : 0;
                const meanIslamicSuccessful = countIslamicSuccessful > 0 ? sumIslamicSuccessful / countIslamicSuccessful : 0;
                const meanCivicsSuccessful = countCivicsSuccessful > 0 ? sumCivicsSuccessful / countCivicsSuccessful : 0;
                const meanHistoryGeographySuccessful = countHistoryGeographySuccessful > 0 ? sumHistoryGeographySuccessful / countHistoryGeographySuccessful : 0;
                const meanMathSuccessful = countMathSuccessful > 0 ? sumMathSuccessful / countMathSuccessful : 0;
                const meanNatureSuccessful = countNatureSuccessful > 0 ? sumNatureSuccessful / countNatureSuccessful : 0;
                const meanPhysicalSuccessful = countPhysicalSuccessful > 0 ? sumPhysicalSuccessful / countPhysicalSuccessful : 0;
                const meanInformaticsSuccessful = countInformaticsSuccessful > 0 ? sumInformaticsSuccessful / countInformaticsSuccessful : 0;
                const meanFineSuccessful = countFineSuccessful > 0 ? sumFineSuccessful / countFineSuccessful : 0;
                const meanMusicSuccessful = countMusicSuccessful > 0 ? sumMusicSuccessful / countMusicSuccessful : 0;
                const meanAthleticSuccessful = countAthleticSuccessful > 0 ? sumAthleticSuccessful / countAthleticSuccessful : 0;
                const meanRateSuccessful = countRateSuccessful > 0 ? sumRateSuccessful / countRateSuccessful : 0;

                // Calculate the percentage of values greater than or equal to 10 for each subject
                const percentageArabicGTenSuccessful = countArabicSuccessful !== 0 ? (countArabicGTenSuccessful / countArabicSuccessful) * 100 : 0;
                const percentageAmazighGTenSuccessful = countAmazighSuccessful !== 0 ? (countAmazighGTenSuccessful / countAmazighSuccessful) * 100 : 0;
                const percentageFrenchGTenSuccessful = countFrenchSuccessful !== 0 ? (countFrenchGTenSuccessful / countFrenchSuccessful) * 100 : 0;
                const percentageEnglishGTenSuccessful = countEnglishSuccessful !== 0 ? (countEnglishGTenSuccessful / countEnglishSuccessful) * 100 : 0;
                const percentageIslamicGTenSuccessful = countIslamicSuccessful !== 0 ? (countIslamicGTenSuccessful / countIslamicSuccessful) * 100 : 0;
                const percentageCivicsGTenSuccessful = countCivicsSuccessful !== 0 ? (countCivicsGTenSuccessful / countCivicsSuccessful) * 100 : 0;
                const percentageHistoryAndGeographyGTenSuccessful = countHistoryGeographySuccessful !== 0 ? (countHistoryGeographyGTenSuccessful / countHistoryGeographySuccessful) * 100 : 0;
                const percentageMathGTenSuccessful = countMathSuccessful !== 0 ? (countMathGTenSuccessful / countMathSuccessful) * 100 : 0;
                const percentageNatureGTenSuccessful = countNatureSuccessful !== 0 ? (countNatureGTenSuccessful / countNatureSuccessful) * 100 : 0;
                const percentagePhysicalGTenSuccessful = countPhysicalSuccessful !== 0 ? (countPhysicalGTenSuccessful / countPhysicalSuccessful) * 100 : 0;
                const percentageInformaticsGTenSuccessful = countInformaticsSuccessful !== 0 ? (countInformaticsGTenSuccessful / countInformaticsSuccessful) * 100 : 0;
                const percentageFineGTenSuccessful = countFineSuccessful !== 0 ? (countFineGTenSuccessful / countFineSuccessful) * 100 : 0;
                const percentageMusicGTenSuccessful = countMusicSuccessful !== 0 ? (countMusicGTenSuccessful / countMusicSuccessful) * 100 : 0;
                const percentageAthleticGTenSuccessful = countAthleticSuccessful !== 0 ? (countAthleticGTenSuccessful / countAthleticSuccessful) * 100 : 0;
                const percentageRateGTenSuccessful = countRateSuccessful !== 0 ? (countRateGTenSuccessful / countRateSuccessful) * 100 : 0;

                // Calculate the percentage of values greater than or equal to 8 less than or equal to 9.99 for each subject
                const percentageArabicBetweenEightAndNineSuccessful = countArabicSuccessful !== 0 ? (countArabicBetweenEightAndNineSuccessful / countArabicSuccessful) * 100 : 0;
                const percentageAmazighBetweenEightAndNineSuccessful = countAmazighSuccessful !== 0 ? (countAmazighBetweenEightAndNineSuccessful / countAmazighSuccessful) * 100 : 0;
                const percentageFrenchBetweenEightAndNineSuccessful = countFrenchSuccessful !== 0 ? (countFrenchBetweenEightAndNineSuccessful / countFrenchSuccessful) * 100 : 0;
                const percentageEnglishBetweenEightAndNineSuccessful = countEnglishSuccessful !== 0 ? (countEnglishBetweenEightAndNineSuccessful / countEnglishSuccessful) * 100 : 0;
                const percentageIslamicBetweenEightAndNineSuccessful = countIslamicSuccessful !== 0 ? (countIslamicBetweenEightAndNineSuccessful / countIslamicSuccessful) * 100 : 0;
                const percentageCivicsBetweenEightAndNineSuccessful = countCivicsSuccessful !== 0 ? (countCivicsBetweenEightAndNineSuccessful / countCivicsSuccessful) * 100 : 0;
                const percentageHistoryAndGeographyBetweenEightAndNineSuccessful = countHistoryGeographySuccessful !== 0 ? (countHistoryGeographyBetweenEightAndNineSuccessful / countHistoryGeographySuccessful) * 100 : 0;
                const percentageMathBetweenEightAndNineSuccessful = countMathSuccessful !== 0 ? (countMathBetweenEightAndNineSuccessful / countMathSuccessful) * 100 : 0;
                const percentageNatureBetweenEightAndNineSuccessful = countNatureSuccessful !== 0 ? (countNatureBetweenEightAndNineSuccessful / countNatureSuccessful) * 100 : 0;
                const percentagePhysicalBetweenEightAndNineSuccessful = countPhysicalSuccessful !== 0 ? (countPhysicalBetweenEightAndNineSuccessful / countPhysicalSuccessful) * 100 : 0;
                const percentageInformaticsBetweenEightAndNineSuccessful = countInformaticsSuccessful !== 0 ? (countInformaticsBetweenEightAndNineSuccessful / countInformaticsSuccessful) * 100 : 0;
                const percentageFineBetweenEightAndNineSuccessful = countFineSuccessful !== 0 ? (countFineBetweenEightAndNineSuccessful / countFineSuccessful) * 100 : 0;
                const percentageMusicBetweenEightAndNineSuccessful = countMusicSuccessful !== 0 ? (countMusicBetweenEightAndNineSuccessful / countMusicSuccessful) * 100 : 0;
                const percentageAthleticBetweenEightAndNineSuccessful = countAthleticSuccessful !== 0 ? (countAthleticBetweenEightAndNineSuccessful / countAthleticSuccessful) * 100 : 0;
                const percentageRateBetweenEightAndNineSuccessful = countRateSuccessful !== 0 ? (countRateBetweenEightAndNineSuccessful / countRateSuccessful) * 100 : 0;

                // Calculate the percentage of values greater than or equal to 1 less than or equal to 8 for each subject
                const percentageArabicLessThanEightSuccessful = countArabicSuccessful !== 0 ? (countArabicLessThanEightSuccessful / countArabicSuccessful) * 100 : 0;
                const percentageAmazighLessThanEightSuccessful = countAmazighSuccessful !== 0 ? (countAmazighLessThanEightSuccessful / countAmazighSuccessful) * 100 : 0;
                const percentageFrenchLessThanEightSuccessful = countFrenchSuccessful !== 0 ? (countFrenchLessThanEightSuccessful / countFrenchSuccessful) * 100 : 0;
                const percentageEnglishLessThanEightSuccessful = countEnglishSuccessful !== 0 ? (countEnglishLessThanEightSuccessful / countEnglishSuccessful) * 100 : 0;
                const percentageIslamicLessThanEightSuccessful = countIslamicSuccessful !== 0 ? (countIslamicLessThanEightSuccessful / countIslamicSuccessful) * 100 : 0;
                const percentageCivicsLessThanEightSuccessful = countCivicsSuccessful !== 0 ? (countCivicsLessThanEightSuccessful / countCivicsSuccessful) * 100 : 0;
                const percentageHistoryAndGeographyLessThanEightSuccessful = countHistoryGeographySuccessful !== 0 ? (countHistoryGeographyLessThanEightSuccessful / countHistoryGeographySuccessful) * 100 : 0;
                const percentageMathLessThanEightSuccessful = countMathSuccessful !== 0 ? (countMathLessThanEightSuccessful / countMathSuccessful) * 100 : 0;
                const percentageNatureLessThanEightSuccessful = countNatureSuccessful !== 0 ? (countNatureLessThanEightSuccessful / countNatureSuccessful) * 100 : 0;
                const percentagePhysicalLessThanEightSuccessful = countPhysicalSuccessful !== 0 ? (countPhysicalLessThanEightSuccessful / countPhysicalSuccessful) * 100 : 0;
                const percentageInformaticsLessThanEightSuccessful = countInformaticsSuccessful !== 0 ? (countInformaticsLessThanEightSuccessful / countInformaticsSuccessful) * 100 : 0;
                const percentageFineLessThanEightSuccessful = countFineSuccessful !== 0 ? (countFineLessThanEightSuccessful / countFineSuccessful) * 100 : 0;
                const percentageMusicLessThanEightSuccessful = countMusicSuccessful !== 0 ? (countMusicLessThanEightSuccessful / countMusicSuccessful) * 100 : 0;
                const percentageAthleticLessThanEightSuccessful = countAthleticSuccessful !== 0 ? (countAthleticLessThanEightSuccessful / countAthleticSuccessful) * 100 : 0;
                const percentageRateLessThanEightSuccessful = countRateSuccessful !== 0 ? (countRateLessThanEightSuccessful / countRateSuccessful) * 100 : 0;
                    
                // Update the HTML elements with the means for each subject
                $('#arabic-meanSuccessful').text(meanArabicSuccessful.toFixed(2));
                $('#amazigh-meanSuccessful').text(meanAmazighSuccessful.toFixed(2));
                $('#french-meanSuccessful').text(meanFrenchSuccessful.toFixed(2));
                $('#english-meanSuccessful').text(meanEnglishSuccessful.toFixed(2));
                $('#islamic-meanSuccessful').text(meanIslamicSuccessful.toFixed(2));
                $('#civics-meanSuccessful').text(meanCivicsSuccessful.toFixed(2));
                $('#historyandgeography-meanSuccessful').text(meanHistoryGeographySuccessful.toFixed(2));
                $('#math-meanSuccessful').text(meanMathSuccessful.toFixed(2));
                $('#nature-meanSuccessful').text(meanNatureSuccessful.toFixed(2));
                $('#physical-meanSuccessful').text(meanPhysicalSuccessful.toFixed(2));
                $('#informatics-meanSuccessful').text(meanInformaticsSuccessful.toFixed(2));
                $('#fine-meanSuccessful').text(meanFineSuccessful.toFixed(2));
                $('#music-meanSuccessful').text(meanMusicSuccessful.toFixed(2));
                $('#athletic-meanSuccessful').text(meanAthleticSuccessful.toFixed(2));
                $('#rate-meanSuccessful').text(meanRateSuccessful.toFixed(2));

                // Add badge dynamically based on mean value
                addBadgeSuccessful('#arabic-meanSuccessful', meanArabicSuccessful);
                addBadgeSuccessful('#amazigh-meanSuccessful', meanAmazighSuccessful);
                addBadgeSuccessful('#french-meanSuccessful', meanFrenchSuccessful);
                addBadgeSuccessful('#english-meanSuccessful', meanEnglishSuccessful);
                addBadgeSuccessful('#islamic-meanSuccessful', meanIslamicSuccessful);
                addBadgeSuccessful('#civics-meanSuccessful', meanCivicsSuccessful);
                addBadgeSuccessful('#historyandgeography-meanSuccessful', meanHistoryGeographySuccessful);
                addBadgeSuccessful('#math-meanSuccessful', meanMathSuccessful);
                addBadgeSuccessful('#nature-meanSuccessful', meanNatureSuccessful);
                addBadgeSuccessful('#physical-meanSuccessful', meanPhysicalSuccessful);
                addBadgeSuccessful('#informatics-meanSuccessful', meanInformaticsSuccessful);
                addBadgeSuccessful('#fine-meanSuccessful', meanFineSuccessful);
                addBadgeSuccessful('#music-meanSuccessful', meanMusicSuccessful);
                addBadgeSuccessful('#athletic-meanSuccessful', meanAthleticSuccessful);
                addBadgeSuccessful('#rate-meanSuccessful', meanRateSuccessful);

                function addBadgeSuccessful(selectorSuccessful, Successful) {
                    if (Successful >=1 && Successful < 10) {
                        $(selectorSuccessful).append('<span class="badge-1" title="تحصل التلاميذ على معدل أو نسبة تقل عن المتوسط">ضعيف</span>');
                    }
                }

                // Update the HTML elements with the means for each subject
                $('#arabic-countGTenSuccessful').text(countArabicGTenSuccessful);
                $('#amazigh-countGTenSuccessful').text(countAmazighGTenSuccessful);
                $('#french-countGTenSuccessful').text(countFrenchGTenSuccessful);
                $('#english-countGTenSuccessful').text(countEnglishGTenSuccessful);
                $('#islamic-countGTenSuccessful').text(countIslamicGTenSuccessful);
                $('#civics-countGTenSuccessful').text(countCivicsGTenSuccessful);
                $('#historyandgeography-countGTenSuccessful').text(countHistoryGeographyGTenSuccessful);
                $('#math-countGTenSuccessful').text(countMathGTenSuccessful);
                $('#nature-countGTenSuccessful').text(countNatureGTenSuccessful);
                $('#physical-countGTenSuccessful').text(countPhysicalGTenSuccessful);
                $('#informatics-countGTenSuccessful').text(countInformaticsGTenSuccessful);
                $('#fine-countGTenSuccessful').text(countFineGTenSuccessful);
                $('#music-countGTenSuccessful').text(countMusicGTenSuccessful);
                $('#athletic-countGTenSuccessful').text(countAthleticGTenSuccessful);
                $('#rate-countGTenSuccessful').text(countRateGTenSuccessful);

                // Update the HTML elements with the means for each subject
                $('#arabic-percentageGTenSuccessful').text(percentageArabicGTenSuccessful.toFixed(2) + "%");
                $('#amazigh-percentageGTenSuccessful').text(percentageAmazighGTenSuccessful.toFixed(2) + "%");
                $('#french-percentageGTenSuccessful').text(percentageFrenchGTenSuccessful.toFixed(2) + "%");
                $('#english-percentageGTenSuccessful').text(percentageEnglishGTenSuccessful.toFixed(2) + "%");
                $('#islamic-percentageGTenSuccessful').text(percentageIslamicGTenSuccessful.toFixed(2) + "%");
                $('#civics-percentageGTenSuccessful').text(percentageCivicsGTenSuccessful.toFixed(2) + "%");
                $('#historyandgeography-percentageGTenSuccessful').text(percentageHistoryAndGeographyGTenSuccessful.toFixed(2) + "%");
                $('#math-percentageGTenSuccessful').text(percentageMathGTenSuccessful.toFixed(2) + "%");
                $('#nature-percentageGTenSuccessful').text(percentageNatureGTenSuccessful.toFixed(2) + "%");
                $('#physical-percentageGTenSuccessful').text(percentagePhysicalGTenSuccessful.toFixed(2) + "%");
                $('#informatics-percentageGTenSuccessful').text(percentageInformaticsGTenSuccessful.toFixed(2) + "%");
                $('#fine-percentageGTenSuccessful').text(percentageFineGTenSuccessful.toFixed(2) + "%");
                $('#music-percentageGTenSuccessful').text(percentageMusicGTenSuccessful.toFixed(2) + "%");
                $('#athletic-percentageGTenSuccessful').text(percentageAthleticGTenSuccessful.toFixed(2) + "%");
                $('#rate-percentageGTenSuccessful').text(percentageRateGTenSuccessful.toFixed(2) + "%");

                // Update the HTML elements with the means for each subject
                $('#arabic-countBEightAndNineSuccessful').text(countArabicBetweenEightAndNineSuccessful);
                $('#amazigh-countBEightAndNineSuccessful').text(countAmazighBetweenEightAndNineSuccessful);
                $('#french-countBEightAndNineSuccessful').text(countFrenchBetweenEightAndNineSuccessful);
                $('#english-countBEightAndNineSuccessful').text(countEnglishBetweenEightAndNineSuccessful);
                $('#islamic-countBEightAndNineSuccessful').text(countIslamicBetweenEightAndNineSuccessful);
                $('#civics-countBEightAndNineSuccessful').text(countCivicsBetweenEightAndNineSuccessful);
                $('#historyandgeography-countBEightAndNineSuccessful').text(countHistoryGeographyBetweenEightAndNineSuccessful);
                $('#math-countBEightAndNineSuccessful').text(countMathBetweenEightAndNineSuccessful);
                $('#nature-countBEightAndNineSuccessful').text(countNatureBetweenEightAndNineSuccessful);
                $('#physical-countBEightAndNineSuccessful').text(countPhysicalBetweenEightAndNineSuccessful);
                $('#informatics-countBEightAndNineSuccessful').text(countInformaticsBetweenEightAndNineSuccessful);
                $('#fine-countBEightAndNineSuccessful').text(countFineBetweenEightAndNineSuccessful);
                $('#music-countBEightAndNineSuccessful').text(countMusicBetweenEightAndNineSuccessful);
                $('#athletic-countBEightAndNineSuccessful').text(countAthleticBetweenEightAndNineSuccessful);
                $('#rate-countBEightAndNineSuccessful').text(countRateBetweenEightAndNineSuccessful);

                // Update the HTML elements with the means for each subject
                $('#arabic-percentageBEightAndNineSuccessful').text(percentageArabicBetweenEightAndNineSuccessful.toFixed(2) + "%");
                $('#amazigh-percentageBEightAndNineSuccessful').text(percentageAmazighBetweenEightAndNineSuccessful.toFixed(2) + "%");
                $('#french-percentageBEightAndNineSuccessful').text(percentageFrenchBetweenEightAndNineSuccessful.toFixed(2) + "%");
                $('#english-percentageBEightAndNineSuccessful').text(percentageEnglishBetweenEightAndNineSuccessful.toFixed(2) + "%");
                $('#islamic-percentageBEightAndNineSuccessful').text(percentageIslamicBetweenEightAndNineSuccessful.toFixed(2) + "%");
                $('#civics-percentageBEightAndNineSuccessful').text(percentageCivicsBetweenEightAndNineSuccessful.toFixed(2) + "%");
                $('#historyandgeography-percentageBEightAndNineSuccessful').text(percentageHistoryAndGeographyBetweenEightAndNineSuccessful.toFixed(2) + "%");
                $('#math-percentageBEightAndNineSuccessful').text(percentageMathBetweenEightAndNineSuccessful.toFixed(2) + "%");
                $('#nature-percentageBEightAndNineSuccessful').text(percentageNatureBetweenEightAndNineSuccessful.toFixed(2) + "%");
                $('#physical-percentageBEightAndNineSuccessful').text(percentagePhysicalBetweenEightAndNineSuccessful.toFixed(2) + "%");
                $('#informatics-percentageBEightAndNineSuccessful').text(percentageInformaticsBetweenEightAndNineSuccessful.toFixed(2) + "%");
                $('#fine-percentageBEightAndNineSuccessful').text(percentageFineBetweenEightAndNineSuccessful.toFixed(2) + "%");
                $('#music-percentageBEightAndNineSuccessful').text(percentageMusicBetweenEightAndNineSuccessful.toFixed(2) + "%");
                $('#athletic-percentageBEightAndNineSuccessful').text(percentageAthleticBetweenEightAndNineSuccessful.toFixed(2) + "%");
                $('#rate-percentageBEightAndNineSuccessful').text(percentageRateBetweenEightAndNineSuccessful.toFixed(2) + "%");

                // Update the HTML elements with the means for each subject
                $('#arabic-countLEightSuccessful').text(countArabicLessThanEightSuccessful);
                $('#amazigh-countLEightSuccessful').text(countAmazighLessThanEightSuccessful);
                $('#french-countLEightSuccessful').text(countFrenchLessThanEightSuccessful);
                $('#english-countLEightSuccessful').text(countEnglishLessThanEightSuccessful);
                $('#islamic-countLEightSuccessful').text(countIslamicLessThanEightSuccessful);
                $('#civics-countLEightSuccessful').text(countCivicsLessThanEightSuccessful);
                $('#historyandgeography-countLEightSuccessful').text(countHistoryGeographyLessThanEightSuccessful);
                $('#math-countLEightSuccessful').text(countMathLessThanEightSuccessful);
                $('#nature-countLEightSuccessful').text(countNatureLessThanEightSuccessful);
                $('#physical-countLEightSuccessful').text(countPhysicalLessThanEightSuccessful);
                $('#informatics-countLEightSuccessful').text(countInformaticsLessThanEightSuccessful);
                $('#fine-countLEightSuccessful').text(countFineLessThanEightSuccessful);
                $('#music-countLEightSuccessful').text(countMusicLessThanEightSuccessful);
                $('#athletic-countLEightSuccessful').text(countAthleticLessThanEightSuccessful);
                $('#rate-countLEightSuccessful').text(countRateLessThanEightSuccessful);

                // Update the HTML elements with the means for each subject
                $('#arabic-percentageLEightSuccessful').text(percentageArabicLessThanEightSuccessful.toFixed(2) + "%");
                $('#amazigh-percentageLEightSuccessful').text(percentageAmazighLessThanEightSuccessful.toFixed(2) + "%");
                $('#french-percentageLEightSuccessful').text(percentageFrenchLessThanEightSuccessful.toFixed(2) + "%");
                $('#english-percentageLEightSuccessful').text(percentageEnglishLessThanEightSuccessful.toFixed(2) + "%");
                $('#islamic-percentageLEightSuccessful').text(percentageIslamicLessThanEightSuccessful.toFixed(2) + "%");
                $('#civics-percentageLEightSuccessful').text(percentageCivicsLessThanEightSuccessful.toFixed(2) + "%");
                $('#historyandgeography-percentageLEightSuccessful').text(percentageHistoryAndGeographyLessThanEightSuccessful.toFixed(2) + "%");
                $('#math-percentageLEightSuccessful').text(percentageMathLessThanEightSuccessful.toFixed(2) + "%");
                $('#nature-percentageLEightSuccessful').text(percentageNatureLessThanEightSuccessful.toFixed(2) + "%");
                $('#physical-percentageLEightSuccessful').text(percentagePhysicalLessThanEightSuccessful.toFixed(2) + "%");
                $('#informatics-percentageLEightSuccessful').text(percentageInformaticsLessThanEightSuccessful.toFixed(2) + "%");
                $('#fine-percentageLEightSuccessful').text(percentageFineLessThanEightSuccessful.toFixed(2) + "%");
                $('#music-percentageLEightSuccessful').text(percentageMusicLessThanEightSuccessful.toFixed(2) + "%");
                $('#athletic-percentageLEightSuccessful').text(percentageAthleticLessThanEightSuccessful.toFixed(2) + "%");
                $('#rate-percentageLEightSuccessful').text(percentageRateLessThanEightSuccessful.toFixed(2) + "%");



                // Outcome DataTable
                // Calculate  DataTable for Outcome
                // Initialize counters for each subject

                // 0 to 8.99
                let countArabicZeroToEight = 0;
                let countAmazighZeroToEight = 0;
                let countFrenchZeroToEight = 0;
                let countEnglishZeroToEight = 0;
                let countIslamicZeroToEight = 0;
                let countCivicsZeroToEight = 0;
                let countHistoryGeographyZeroToEight = 0;
                let countMathZeroToEight = 0;
                let countNatureZeroToEight = 0;
                let countPhysicalZeroToEight = 0;
                let countInformaticsZeroToEight = 0;
                let countFineZeroToEight = 0;
                let countMusicZeroToEight = 0;
                let countAthleticZeroToEight = 0;
                let countRateZeroToEight = 0;

                // 9 to 9.99
                let countArabicNineToNinePointNine = 0;
                let countAmazighNineToNinePointNine = 0;
                let countFrenchNineToNinePointNine = 0;
                let countEnglishNineToNinePointNine = 0;
                let countIslamicNineToNinePointNine = 0;
                let countCivicsNineToNinePointNine = 0;
                let countHistoryGeographyNineToNinePointNine = 0;
                let countMathNineToNinePointNine = 0;
                let countNatureNineToNinePointNine = 0;
                let countPhysicalNineToNinePointNine = 0;
                let countInformaticsNineToNinePointNine = 0;
                let countFineNineToNinePointNine = 0;
                let countMusicNineToNinePointNine = 0;
                let countAthleticNineToNinePointNine = 0;
                let countRateNineToNinePointNine = 0;
                // 10 to 1.99
                let countArabicTenToElevenPointNine = 0;
                let countAmazighTenToElevenPointNine = 0;
                let countFrenchTenToElevenPointNine = 0;
                let countEnglishTenToElevenPointNine = 0;
                let countIslamicTenToElevenPointNine = 0;
                let countCivicsTenToElevenPointNine = 0;
                let countHistoryGeographyTenToElevenPointNine = 0;
                let countMathTenToElevenPointNine = 0;
                let countNatureTenToElevenPointNine = 0;
                let countPhysicalTenToElevenPointNine = 0;
                let countInformaticsTenToElevenPointNine = 0;
                let countFineTenToElevenPointNine = 0;
                let countMusicTenToElevenPointNine = 0;
                let countAthleticTenToElevenPointNine = 0;
                let countRateTenToElevenPointNine = 0;
                // 12 to 13.99
                let countArabicTwelveToThirteenPointNine = 0;
                let countAmazighTwelveToThirteenPointNine = 0;
                let countFrenchTwelveToThirteenPointNine = 0;
                let countEnglishTwelveToThirteenPointNine = 0;
                let countIslamicTwelveToThirteenPointNine = 0;
                let countCivicsTwelveToThirteenPointNine = 0;
                let countHistoryGeographyTwelveToThirteenPointNine = 0;
                let countMathTwelveToThirteenPointNine = 0;
                let countNatureTwelveToThirteenPointNine = 0;
                let countPhysicalTwelveToThirteenPointNine = 0;
                let countInformaticsTwelveToThirteenPointNine = 0;
                let countFineTwelveToThirteenPointNine = 0;
                let countMusicTwelveToThirteenPointNine = 0;
                let countAthleticTwelveToThirteenPointNine = 0;
                let countRateTwelveToThirteenPointNine = 0;
                // 14 to 15.99
                let countArabicFourteenToFifteenPointNine = 0;
                let countAmazighFourteenToFifteenPointNine = 0;
                let countFrenchFourteenToFifteenPointNine = 0;
                let countEnglishFourteenToFifteenPointNine = 0;
                let countIslamicFourteenToFifteenPointNine = 0;
                let countCivicsFourteenToFifteenPointNine = 0;
                let countHistoryGeographyFourteenToFifteenPointNine = 0;
                let countMathFourteenToFifteenPointNine = 0;
                let countNatureFourteenToFifteenPointNine = 0;
                let countPhysicalFourteenToFifteenPointNine = 0;
                let countInformaticsFourteenToFifteenPointNine = 0;
                let countFineFourteenToFifteenPointNine = 0;
                let countMusicFourteenToFifteenPointNine = 0;
                let countAthleticFourteenToFifteenPointNine = 0;
                let countRateFourteenToFifteenPointNine = 0;
                // 16 to 17.99
                let countArabicSixteenToSeventeenPointNine = 0;
                let countAmazighSixteenToSeventeenPointNine = 0;
                let countFrenchSixteenToSeventeenPointNine = 0;
                let countEnglishSixteenToSeventeenPointNine = 0;
                let countIslamicSixteenToSeventeenPointNine = 0;
                let countCivicsSixteenToSeventeenPointNine = 0;
                let countHistoryGeographySixteenToSeventeenPointNine = 0;
                let countMathSixteenToSeventeenPointNine = 0;
                let countNatureSixteenToSeventeenPointNine = 0;
                let countPhysicalSixteenToSeventeenPointNine = 0;
                let countInformaticsSixteenToSeventeenPointNine = 0;
                let countFineSixteenToSeventeenPointNine = 0;
                let countMusicSixteenToSeventeenPointNine = 0;
                let countAthleticSixteenToSeventeenPointNine = 0;
                let countRateSixteenToSeventeenPointNine = 0;
                
                // 18 to 20
                let countArabicEighteenToTwenty = 0;
                let countAmazighEighteenToTwenty = 0;
                let countFrenchEighteenToTwenty = 0;
                let countEnglishEighteenToTwenty = 0;
                let countIslamicEighteenToTwenty = 0;
                let countCivicsEighteenToTwenty = 0;
                let countHistoryGeographyEighteenToTwenty = 0;
                let countMathEighteenToTwenty = 0;
                let countNatureEighteenToTwenty = 0;
                let countPhysicalEighteenToTwenty = 0;
                let countInformaticsEighteenToTwenty = 0;
                let countFineEighteenToTwenty = 0;
                let countMusicEighteenToTwenty = 0;
                let countAthleticEighteenToTwenty = 0;
                let countRateEighteenToTwenty = 0;


                // Iterate over each row in the table
                table.rows().every(function () {
                    const rowData = this.data();

                    const arabicValue = parseFloat(rowData['اللغة العربية ف 2']) || 0;
                    const amazighValue = parseFloat(rowData['اللغة اﻷمازيغية ف 2']) || 0;
                    const frenchValue = parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
                    const englishValue = parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
                    const islamicValue = parseFloat(rowData['التربية الإسلامية ف 2']) || 0;
                    const civicsValue = parseFloat(rowData['التربية المدنية ف 2']) || 0;
                    const historyGeographyValue = parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
                    const mathValue = parseFloat(rowData['الرياضيات ف 2']) || 0;
                    const natureValue = parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
                    const physicalValue = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                    const informaticsValue = parseFloat(rowData['المعلوماتية ف 2']) || 0;
                    const fineValue = parseFloat(rowData['التربية التشكيلية ف 2']) || 0;
                    const musicValue = parseFloat(rowData['التربية الموسيقية ف 2']) || 0;
                    const athleticValue = parseFloat(rowData['ت البدنية و الرياضية ف 2']) || 0;
                    const rateValue = parseFloat(rowData['معدل الفصل 2']) || 0;

                    // 0 to 8.99
                    if (arabicValue >= 1 && arabicValue <=8.99) {
                        countArabicZeroToEight++;
                    }
                    if (amazighValue >= 1 && amazighValue <=8.99) {
                        countAmazighZeroToEight++;
                    }
                    if (frenchValue >= 1 && frenchValue <=8.99) {
                        countFrenchZeroToEight++;
                    }
                    if (englishValue >= 1 && englishValue <=8.99) {
                        countEnglishZeroToEight++;
                    }
                    if (islamicValue >= 1 && islamicValue <=8.99) {
                        countIslamicZeroToEight++;
                    }
                    if (civicsValue >= 1 && civicsValue <=8.99) {
                        countCivicsZeroToEight++;
                    }
                    if (historyGeographyValue >= 1 && historyGeographyValue <=8.99) {
                        countHistoryGeographyZeroToEight++;
                    }
                    if (mathValue >= 1 && mathValue <=8.99) {
                        countMathZeroToEight++;
                    }
                    if (natureValue >= 1 && natureValue <=8.99) {
                        countNatureZeroToEight++;
                    }
                    if (physicalValue >= 1 && physicalValue <=8.99) {
                        countPhysicalZeroToEight++;
                    }
                    if (informaticsValue >= 1 && informaticsValue <=8.99) {
                        countInformaticsZeroToEight++;
                    }
                    if (fineValue >= 1 && fineValue <=8.99) {
                        countFineZeroToEight++;
                    }
                    if (musicValue >= 1 && musicValue <=8.99) {
                        countMusicZeroToEight++;
                    }
                    if (athleticValue >= 1 && athleticValue <=8.99) {
                        countAthleticZeroToEight++;
                    }
                    if (rateValue >= 1 && rateValue <=8.99) {
                        countRateZeroToEight++;
                    }

                    // 9 to 9.99
                    if (arabicValue >= 9 && arabicValue <=9.99) {
                        countArabicNineToNinePointNine++;
                    }
                    if (amazighValue >= 9 && amazighValue <=9.99) {
                        countAmazighNineToNinePointNine++;
                    }
                    if (frenchValue >= 9 && frenchValue <=9.99) {
                        countFrenchNineToNinePointNine++;
                    }
                    if (englishValue >= 9 && englishValue <=9.99) {
                        countEnglishNineToNinePointNine++;
                    }
                    if (islamicValue >= 9 && islamicValue <=9.99) {
                        countIslamicNineToNinePointNine++;
                    }
                    if (civicsValue >= 9 && civicsValue <=9.99) {
                        countCivicsNineToNinePointNine++;
                    }
                    if (historyGeographyValue >= 9 && historyGeographyValue <=9.99) {
                        countHistoryGeographyNineToNinePointNine++;
                    }
                    if (mathValue >= 9 && mathValue <=9.99) {
                        countMathNineToNinePointNine++;
                    }
                    if (natureValue >= 9 && natureValue <=9.99) {
                        countNatureNineToNinePointNine++;
                    }
                    if (physicalValue >= 9 && physicalValue <= 9.99) {
                        countPhysicalNineToNinePointNine++;
                    }
                    if (informaticsValue >= 9 && informaticsValue <=9.99) {
                        countInformaticsNineToNinePointNine++;
                    }
                    if (fineValue >= 9 && fineValue <=9.99) {
                        countFineNineToNinePointNine++;
                    }
                    if (musicValue >= 9 && musicValue <=9.99) {
                        countMusicNineToNinePointNine++;
                    }
                    if (athleticValue >= 9 && athleticValue <=9.99) {
                        countAthleticNineToNinePointNine++;
                    }
                    if (rateValue >= 9 && rateValue <=9.99) {
                        countRateNineToNinePointNine++;
                    }

                    // 10 to 11.99
                    if (arabicValue >= 10 && arabicValue <= 11.99) {
                        countArabicTenToElevenPointNine++;
                    }
                    if (amazighValue >= 10 && amazighValue <= 11.99) {
                        countAmazighTenToElevenPointNine++;
                    }
                    if (frenchValue >= 10 && frenchValue <= 11.99) {
                        countFrenchTenToElevenPointNine++;
                    }
                    if (englishValue >= 10 && englishValue <= 11.99) {
                        countEnglishTenToElevenPointNine++;
                    }
                    if (islamicValue >= 10 && islamicValue <= 11.99) {
                        countIslamicTenToElevenPointNine++;
                    }
                    if (civicsValue >= 10 && civicsValue <= 11.99) {
                        countCivicsTenToElevenPointNine++;
                    }
                    if (historyGeographyValue >= 10 && historyGeographyValue <= 11.99) {
                        countHistoryGeographyTenToElevenPointNine++;
                    }
                    if (mathValue >= 10 && mathValue <= 11.99) {
                        countMathTenToElevenPointNine++;
                    }
                    if (natureValue >= 10 && natureValue <= 11.99) {
                        countNatureTenToElevenPointNine++;
                    }
                    if (physicalValue >= 10 && physicalValue <= 11.99) {
                        countPhysicalTenToElevenPointNine++;
                    }
                    if (informaticsValue >= 10 && informaticsValue <= 11.99) {
                        countInformaticsTenToElevenPointNine++;
                    }
                    if (fineValue >= 10 && fineValue <= 11.99) {
                        countFineTenToElevenPointNine++;
                    }
                    if (musicValue >= 10 && musicValue <= 11.99) {
                        countMusicTenToElevenPointNine++;
                    }
                    if (athleticValue >= 10 && athleticValue <= 11.99) {
                        countAthleticTenToElevenPointNine++;
                    }
                    if (rateValue >= 10 && rateValue <= 11.99) {
                        countRateTenToElevenPointNine++;
                    }

                    // 12 to 13.99
                    if (arabicValue >= 12 && arabicValue <= 13.99) {
                        countArabicTwelveToThirteenPointNine++;
                    }
                    if (amazighValue >= 12 && amazighValue <= 13.99) {
                        countAmazighTwelveToThirteenPointNine++;
                    }
                    if (frenchValue >= 12 && frenchValue <= 13.99) {
                        countFrenchTwelveToThirteenPointNine++;
                    }
                    if (englishValue >= 12 && englishValue <= 13.99) {
                        countEnglishTwelveToThirteenPointNine++;
                    }
                    if (islamicValue >= 12 && islamicValue <= 13.99) {
                        countIslamicTwelveToThirteenPointNine++;
                    }
                    if (civicsValue >= 12 && civicsValue <= 13.99) {
                        countCivicsTwelveToThirteenPointNine++;
                    }
                    if (historyGeographyValue >= 12 && historyGeographyValue <= 13.99) {
                        countHistoryGeographyTwelveToThirteenPointNine++;
                    }
                    if (mathValue >= 12 && mathValue <= 13.99) {
                        countMathTwelveToThirteenPointNine++;
                    }
                    if (natureValue >= 12 && natureValue <= 13.99) {
                        countNatureTwelveToThirteenPointNine++;
                    }
                    if (physicalValue >= 12 && physicalValue <= 13.99) {
                        countPhysicalTwelveToThirteenPointNine++;
                    }
                    if (informaticsValue >= 12 && informaticsValue <= 13.99) {
                        countInformaticsTwelveToThirteenPointNine++;
                    }
                    if (fineValue >= 12 && fineValue <= 13.99) {
                        countFineTwelveToThirteenPointNine++;
                    }
                    if (musicValue >= 12 && musicValue <= 13.99) {
                        countMusicTwelveToThirteenPointNine++;
                    }
                    if (athleticValue >= 12 && athleticValue <= 13.99) {
                        countAthleticTwelveToThirteenPointNine++;
                    }
                    if (rateValue >= 12 && rateValue <= 13.99) {
                        countRateTwelveToThirteenPointNine++;
                    }

                    // 14 to 15.99
                    if (arabicValue >= 14 && arabicValue <= 15.99) {
                        countArabicFourteenToFifteenPointNine++;
                    }
                    if (amazighValue >= 14 && amazighValue <= 15.99) {
                        countAmazighFourteenToFifteenPointNine++;
                    }
                    if (frenchValue >= 14 && frenchValue <= 15.99) {
                        countFrenchFourteenToFifteenPointNine++;
                    }
                    if (englishValue >= 14 && englishValue <= 15.99) {
                        countEnglishFourteenToFifteenPointNine++;
                    }
                    if (islamicValue >= 14 && islamicValue <= 15.99) {
                        countIslamicFourteenToFifteenPointNine++;
                    }
                    if (civicsValue >= 14 && civicsValue <= 15.99) {
                        countCivicsFourteenToFifteenPointNine++;
                    }
                    if (historyGeographyValue >= 14 && historyGeographyValue <= 15.99) {
                        countHistoryGeographyFourteenToFifteenPointNine++;
                    }
                    if (mathValue >= 14 && mathValue <= 15.99) {
                        countMathFourteenToFifteenPointNine++;
                    }
                    if (natureValue >= 14 && natureValue <= 15.99) {
                        countNatureFourteenToFifteenPointNine++;
                    }
                    if (physicalValue >= 14 && physicalValue <= 15.99) {
                        countPhysicalFourteenToFifteenPointNine++;
                    }
                    if (informaticsValue >= 14 && informaticsValue <= 15.99) {
                        countInformaticsFourteenToFifteenPointNine++;
                    }
                    if (fineValue >= 14 && fineValue <= 15.99) {
                        countFineFourteenToFifteenPointNine++;
                    }
                    if (musicValue >= 14 && musicValue <= 15.99) {
                        countMusicFourteenToFifteenPointNine++;
                    }
                    if (athleticValue >= 14 && athleticValue <= 15.99) {
                        countAthleticFourteenToFifteenPointNine++;
                    }
                    if (rateValue >= 14 && rateValue <= 15.99) {
                        countRateFourteenToFifteenPointNine++;
                    }

                    // 16 to 17.99
                    if (arabicValue >= 16 && arabicValue <= 17.99) {
                        countArabicSixteenToSeventeenPointNine++;
                    }
                    if (amazighValue >= 16 && amazighValue <= 17.99) {
                        countAmazighSixteenToSeventeenPointNine++;
                    }
                    if (frenchValue >= 16 && frenchValue <= 17.99) {
                        countFrenchSixteenToSeventeenPointNine++;
                    }
                    if (englishValue >= 16 && englishValue <= 17.99) {
                        countEnglishSixteenToSeventeenPointNine++;
                    }
                    if (islamicValue >= 16 && islamicValue <= 17.99) {
                        countIslamicSixteenToSeventeenPointNine++;
                    }
                    if (civicsValue >= 16 && civicsValue <= 17.99) {
                        countCivicsSixteenToSeventeenPointNine++;
                    }
                    if (historyGeographyValue >= 16 && historyGeographyValue <= 17.99) {
                        countHistoryGeographySixteenToSeventeenPointNine++;
                    }
                    if (mathValue >= 16 && mathValue <= 17.99) {
                        countMathSixteenToSeventeenPointNine++;
                    }
                    if (natureValue >= 16 && natureValue <= 17.99) {
                        countNatureSixteenToSeventeenPointNine++;
                    }
                    if (physicalValue >= 16 && physicalValue <= 17.99) {
                        countPhysicalSixteenToSeventeenPointNine++;
                    }
                    if (informaticsValue >= 16 && informaticsValue <= 17.99) {
                        countInformaticsSixteenToSeventeenPointNine++;
                    }
                    if (fineValue >= 16 && fineValue <= 17.99) {
                        countFineSixteenToSeventeenPointNine++;
                    }
                    if (musicValue >= 16 && musicValue <= 17.99) {
                        countMusicSixteenToSeventeenPointNine++;
                    }
                    if (athleticValue >= 16 && athleticValue <= 17.99) {
                        countAthleticSixteenToSeventeenPointNine++;
                    }
                    if (rateValue >= 16 && rateValue <= 17.99) {
                        countRateSixteenToSeventeenPointNine++;
                    }

                    // 18 to 20
                    if (arabicValue >= 18 && arabicValue <= 20) {
                        countArabicEighteenToTwenty++;
                    }
                    if (amazighValue >= 18 && amazighValue <= 20) {
                        countAmazighEighteenToTwenty++;
                    }
                    if (frenchValue >= 18 && frenchValue <= 20) {
                        countFrenchEighteenToTwenty++;
                    }
                    if (englishValue >= 18 && englishValue <= 20) {
                        countEnglishEighteenToTwenty++;
                    }
                    if (islamicValue >= 18 && islamicValue <= 20) {
                        countIslamicEighteenToTwenty++;
                    }
                    if (civicsValue >= 18 && civicsValue <= 20) {
                        countCivicsEighteenToTwenty++;
                    }
                    if (historyGeographyValue >= 18 && historyGeographyValue <= 20) {
                        countHistoryGeographyEighteenToTwenty++;
                    }
                    if (mathValue >= 18 && mathValue <= 20) {
                        countMathEighteenToTwenty++;
                    }
                    if (natureValue >= 18 && natureValue <= 20) {
                        countNatureEighteenToTwenty++;
                    }
                    if (physicalValue >= 18 && physicalValue <= 20) {
                        countPhysicalEighteenToTwenty++;
                    }
                    if (informaticsValue >= 18 && informaticsValue <= 20) {
                        countInformaticsEighteenToTwenty++;
                    }
                    if (fineValue >= 18 && fineValue <= 20) {
                        countFineEighteenToTwenty++;
                    }
                    if (musicValue >= 18 && musicValue <= 20) {
                        countMusicEighteenToTwenty++;
                    }
                    if (athleticValue >= 18 && athleticValue <= 20) {
                        countAthleticEighteenToTwenty++;
                    }
                    if (rateValue >= 18 && rateValue <= 20) {
                        countRateEighteenToTwenty++;
                    }

                    // Continue iteration over rows
                    return true;
                });


                // Calculate the percentage of values greater than or equal to 10 for each subject
                // 0 to 8.99
                const percentageArabicZeroToEight = (countArabicZeroToEight / table.rows().count()) * 100;
                const percentageAmazighZeroToEight = (countAmazighZeroToEight / table.rows().count()) * 100;
                const percentageFrenchZeroToEight = (countFrenchZeroToEight / table.rows().count()) * 100;
                const percentageEnglishZeroToEight = (countEnglishZeroToEight / table.rows().count()) * 100;
                const percentageIslamicZeroToEight = (countIslamicZeroToEight / table.rows().count()) * 100;
                const percentageCivicsZeroToEight = (countCivicsZeroToEight / table.rows().count()) * 100;
                const percentageHistoryAndGeographyZeroToEight = (countHistoryGeographyZeroToEight / table.rows().count()) * 100;
                const percentageMathZeroToEight = (countMathZeroToEight / table.rows().count()) * 100;
                const percentageNatureZeroToEight = (countNatureZeroToEight / table.rows().count()) * 100;
                const percentagePhysicalZeroToEight = (countPhysicalZeroToEight / table.rows().count()) * 100;
                const percentageInformaticsZeroToEight = (countInformaticsZeroToEight / table.rows().count()) * 100;
                const percentageFineZeroToEight = (countFineZeroToEight / table.rows().count()) * 100;
                const percentageMusicZeroToEight = (countMusicZeroToEight / table.rows().count()) * 100;
                const percentageAthleticZeroToEight = (countAthleticZeroToEight / table.rows().count()) * 100;
                const percentageRateZeroToEight = (countRateZeroToEight / table.rows().count()) * 100;

                // 9 to 9.99
                const percentageArabicNineToNinePointNine = (countArabicNineToNinePointNine / table.rows().count()) * 100;
                const percentageAmazighNineToNinePointNine = (countAmazighNineToNinePointNine / table.rows().count()) * 100;
                const percentageFrenchNineToNinePointNine = (countFrenchNineToNinePointNine / table.rows().count()) * 100;
                const percentageEnglishNineToNinePointNine = (countEnglishNineToNinePointNine / table.rows().count()) * 100;
                const percentageIslamicNineToNinePointNine = (countIslamicNineToNinePointNine / table.rows().count()) * 100;
                const percentageCivicsNineToNinePointNine = (countCivicsNineToNinePointNine / table.rows().count()) * 100;
                const percentageHistoryAndGeographyNineToNinePointNine = (countHistoryGeographyNineToNinePointNine / table.rows().count()) * 100;
                const percentageMathNineToNinePointNine = (countMathNineToNinePointNine / table.rows().count()) * 100;
                const percentageNatureNineToNinePointNine = (countNatureNineToNinePointNine / table.rows().count()) * 100;
                const percentagePhysicalNineToNinePointNine = (countPhysicalNineToNinePointNine / table.rows().count()) * 100;
                const percentageInformaticsNineToNinePointNine = (countInformaticsNineToNinePointNine / table.rows().count()) * 100;
                const percentageFineNineToNinePointNine = (countFineNineToNinePointNine / table.rows().count()) * 100;
                const percentageMusicNineToNinePointNine = (countMusicNineToNinePointNine / table.rows().count()) * 100;
                const percentageAthleticNineToNinePointNine = (countAthleticNineToNinePointNine / table.rows().count()) * 100;
                const percentageRateNineToNinePointNine = (countRateNineToNinePointNine / table.rows().count()) * 100;

                // 10 to 11.99
                const percentageArabicTenToElevenPointNine = (countArabicTenToElevenPointNine / table.rows().count()) * 100;
                const percentageAmazighTenToElevenPointNine = (countAmazighTenToElevenPointNine / table.rows().count()) * 100;
                const percentageFrenchTenToElevenPointNine = (countFrenchTenToElevenPointNine / table.rows().count()) * 100;
                const percentageEnglishTenToElevenPointNine = (countEnglishTenToElevenPointNine / table.rows().count()) * 100;
                const percentageIslamicTenToElevenPointNine = (countIslamicTenToElevenPointNine / table.rows().count()) * 100;
                const percentageCivicsTenToElevenPointNine = (countCivicsTenToElevenPointNine / table.rows().count()) * 100;
                const percentageHistoryAndGeographyTenToElevenPointNine = (countHistoryGeographyTenToElevenPointNine / table.rows().count()) * 100;
                const percentageMathTenToElevenPointNine = (countMathTenToElevenPointNine / table.rows().count()) * 100;
                const percentageNatureTenToElevenPointNine = (countNatureTenToElevenPointNine / table.rows().count()) * 100;
                const percentagePhysicalTenToElevenPointNine = (countPhysicalTenToElevenPointNine / table.rows().count()) * 100;
                const percentageInformaticsTenToElevenPointNine = (countInformaticsTenToElevenPointNine / table.rows().count()) * 100;
                const percentageFineTenToElevenPointNine = (countFineTenToElevenPointNine / table.rows().count()) * 100;
                const percentageMusicTenToElevenPointNine = (countMusicTenToElevenPointNine / table.rows().count()) * 100;
                const percentageAthleticTenToElevenPointNine = (countAthleticTenToElevenPointNine / table.rows().count()) * 100;
                const percentageRateTenToElevenPointNine = (countRateTenToElevenPointNine / table.rows().count()) * 100;

                // 12 to 13.99
                const percentageArabicTwelveToThirteenPointNine = (countArabicTwelveToThirteenPointNine / table.rows().count()) * 100;
                const percentageAmazighTwelveToThirteenPointNine = (countAmazighTwelveToThirteenPointNine / table.rows().count()) * 100;
                const percentageFrenchTwelveToThirteenPointNine = (countFrenchTwelveToThirteenPointNine / table.rows().count()) * 100;
                const percentageEnglishTwelveToThirteenPointNine = (countEnglishTwelveToThirteenPointNine / table.rows().count()) * 100;
                const percentageIslamicTwelveToThirteenPointNine = (countIslamicTwelveToThirteenPointNine / table.rows().count()) * 100;
                const percentageCivicsTwelveToThirteenPointNine = (countCivicsTwelveToThirteenPointNine / table.rows().count()) * 100;
                const percentageHistoryAndGeographyTwelveToThirteenPointNine = (countHistoryGeographyTwelveToThirteenPointNine / table.rows().count()) * 100;
                const percentageMathTwelveToThirteenPointNine = (countMathTwelveToThirteenPointNine / table.rows().count()) * 100;
                const percentageNatureTwelveToThirteenPointNine = (countNatureTwelveToThirteenPointNine / table.rows().count()) * 100;
                const percentagePhysicalTwelveToThirteenPointNine = (countPhysicalTwelveToThirteenPointNine / table.rows().count()) * 100;
                const percentageInformaticsTwelveToThirteenPointNine = (countInformaticsTwelveToThirteenPointNine / table.rows().count()) * 100;
                const percentageFineTwelveToThirteenPointNine = (countFineTwelveToThirteenPointNine / table.rows().count()) * 100;
                const percentageMusicTwelveToThirteenPointNine = (countMusicTwelveToThirteenPointNine / table.rows().count()) * 100;
                const percentageAthleticTwelveToThirteenPointNine = (countAthleticTwelveToThirteenPointNine / table.rows().count()) * 100;
                const percentageRateTwelveToThirteenPointNine = (countRateTwelveToThirteenPointNine / table.rows().count()) * 100;

                // 14 to 15.99
                const percentageArabicFourteenToFifteenPointNine = (countArabicFourteenToFifteenPointNine / table.rows().count()) * 100;
                const percentageAmazighFourteenToFifteenPointNine = (countAmazighFourteenToFifteenPointNine / table.rows().count()) * 100;
                const percentageFrenchFourteenToFifteenPointNine = (countFrenchFourteenToFifteenPointNine / table.rows().count()) * 100;
                const percentageEnglishFourteenToFifteenPointNine = (countEnglishFourteenToFifteenPointNine / table.rows().count()) * 100;
                const percentageIslamicFourteenToFifteenPointNine = (countIslamicFourteenToFifteenPointNine / table.rows().count()) * 100;
                const percentageCivicsFourteenToFifteenPointNine = (countCivicsFourteenToFifteenPointNine / table.rows().count()) * 100;
                const percentageHistoryAndGeographyFourteenToFifteenPointNine = (countHistoryGeographyFourteenToFifteenPointNine / table.rows().count()) * 100;
                const percentageMathFourteenToFifteenPointNine = (countMathFourteenToFifteenPointNine / table.rows().count()) * 100;
                const percentageNatureFourteenToFifteenPointNine = (countNatureFourteenToFifteenPointNine / table.rows().count()) * 100;
                const percentagePhysicalFourteenToFifteenPointNine = (countPhysicalFourteenToFifteenPointNine / table.rows().count()) * 100;
                const percentageInformaticsFourteenToFifteenPointNine = (countInformaticsFourteenToFifteenPointNine / table.rows().count()) * 100;
                const percentageFineFourteenToFifteenPointNine = (countFineFourteenToFifteenPointNine / table.rows().count()) * 100;
                const percentageMusicFourteenToFifteenPointNine = (countMusicFourteenToFifteenPointNine / table.rows().count()) * 100;
                const percentageAthleticFourteenToFifteenPointNine = (countAthleticFourteenToFifteenPointNine / table.rows().count()) * 100;
                const percentageRateFourteenToFifteenPointNine = (countRateFourteenToFifteenPointNine / table.rows().count()) * 100;

                // 16 to 17.99
                const percentageArabicSixteenToSeventeenPointNine = (countArabicSixteenToSeventeenPointNine / table.rows().count()) * 100;
                const percentageAmazighSixteenToSeventeenPointNine = (countAmazighSixteenToSeventeenPointNine / table.rows().count()) * 100;
                const percentageFrenchSixteenToSeventeenPointNine = (countFrenchSixteenToSeventeenPointNine / table.rows().count()) * 100;
                const percentageEnglishSixteenToSeventeenPointNine = (countEnglishSixteenToSeventeenPointNine / table.rows().count()) * 100;
                const percentageIslamicSixteenToSeventeenPointNine = (countIslamicSixteenToSeventeenPointNine / table.rows().count()) * 100;
                const percentageCivicsSixteenToSeventeenPointNine = (countCivicsSixteenToSeventeenPointNine / table.rows().count()) * 100;
                const percentageHistoryAndGeographySixteenToSeventeenPointNine = (countHistoryGeographySixteenToSeventeenPointNine / table.rows().count()) * 100;
                const percentageMathSixteenToSeventeenPointNine = (countMathSixteenToSeventeenPointNine / table.rows().count()) * 100;
                const percentageNatureSixteenToSeventeenPointNine = (countNatureSixteenToSeventeenPointNine / table.rows().count()) * 100;
                const percentagePhysicalSixteenToSeventeenPointNine = (countPhysicalSixteenToSeventeenPointNine / table.rows().count()) * 100;
                const percentageInformaticsSixteenToSeventeenPointNine = (countInformaticsSixteenToSeventeenPointNine / table.rows().count()) * 100;
                const percentageFineSixteenToSeventeenPointNine = (countFineSixteenToSeventeenPointNine / table.rows().count()) * 100;
                const percentageMusicSixteenToSeventeenPointNine = (countMusicSixteenToSeventeenPointNine / table.rows().count()) * 100;
                const percentageAthleticSixteenToSeventeenPointNine = (countAthleticSixteenToSeventeenPointNine / table.rows().count()) * 100;
                const percentageRateSixteenToSeventeenPointNine = (countRateSixteenToSeventeenPointNine / table.rows().count()) * 100;

                // 18 to 20
                const percentageArabicEighteenToTwenty = (countArabicEighteenToTwenty / table.rows().count()) * 100;
                const percentageAmazighEighteenToTwenty = (countAmazighEighteenToTwenty / table.rows().count()) * 100;
                const percentageFrenchEighteenToTwenty = (countFrenchEighteenToTwenty / table.rows().count()) * 100;
                const percentageEnglishEighteenToTwenty = (countEnglishEighteenToTwenty / table.rows().count()) * 100;
                const percentageIslamicEighteenToTwenty = (countIslamicEighteenToTwenty / table.rows().count()) * 100;
                const percentageCivicsEighteenToTwenty = (countCivicsEighteenToTwenty / table.rows().count()) * 100;
                const percentageHistoryAndGeographyEighteenToTwenty = (countHistoryGeographyEighteenToTwenty / table.rows().count()) * 100;
                const percentageMathEighteenToTwenty = (countMathEighteenToTwenty / table.rows().count()) * 100;
                const percentageNatureEighteenToTwenty = (countNatureEighteenToTwenty / table.rows().count()) * 100;
                const percentagePhysicalEighteenToTwenty = (countPhysicalEighteenToTwenty / table.rows().count()) * 100;
                const percentageInformaticsEighteenToTwenty = (countInformaticsEighteenToTwenty / table.rows().count()) * 100;
                const percentageFineEighteenToTwenty = (countFineEighteenToTwenty / table.rows().count()) * 100;
                const percentageMusicEighteenToTwenty = (countMusicEighteenToTwenty / table.rows().count()) * 100;
                const percentageAthleticEighteenToTwenty = (countAthleticEighteenToTwenty / table.rows().count()) * 100;
                const percentageRateEighteenToTwenty = (countRateEighteenToTwenty / table.rows().count()) * 100;


                // Update the HTML elements with the means for each subject
                // 0 to 8.99
                $('#arabic-countZeroToEight').text(countArabicZeroToEight);
                $('#amazigh-countZeroToEight').text(countAmazighZeroToEight);
                $('#french-countZeroToEight').text(countFrenchZeroToEight);
                $('#english-countZeroToEight').text(countEnglishZeroToEight);
                $('#islamic-countZeroToEight').text(countIslamicZeroToEight);
                $('#civics-countZeroToEight').text(countCivicsZeroToEight);
                $('#historyandgeography-countZeroToEight').text(countHistoryGeographyZeroToEight);
                $('#math-countZeroToEight').text(countMathZeroToEight);
                $('#nature-countZeroToEight').text(countNatureZeroToEight);
                $('#physical-countZeroToEight').text(countPhysicalZeroToEight);
                $('#informatics-countZeroToEight').text(countInformaticsZeroToEight);
                $('#fine-countZeroToEight').text(countFineZeroToEight);
                $('#music-countZeroToEight').text(countMusicZeroToEight);
                $('#athletic-countZeroToEight').text(countAthleticZeroToEight);
                $('#rate-countZeroToEight').text(countRateZeroToEight);

                // 9 to 9.99
                $('#arabic-countNineToNinePointNine').text(countArabicNineToNinePointNine);
                $('#amazigh-countNineToNinePointNine').text(countAmazighNineToNinePointNine);
                $('#french-countNineToNinePointNine').text(countFrenchNineToNinePointNine);
                $('#english-countNineToNinePointNine').text(countEnglishNineToNinePointNine);
                $('#islamic-countNineToNinePointNine').text(countIslamicNineToNinePointNine);
                $('#civics-countNineToNinePointNine').text(countCivicsNineToNinePointNine);
                $('#historyandgeography-countNineToNinePointNine').text(countHistoryGeographyNineToNinePointNine);
                $('#math-countNineToNinePointNine').text(countMathNineToNinePointNine);
                $('#nature-countNineToNinePointNine').text(countNatureNineToNinePointNine);
                $('#physical-countNineToNinePointNine').text(countPhysicalNineToNinePointNine);
                $('#informatics-countNineToNinePointNine').text(countInformaticsNineToNinePointNine);
                $('#fine-countNineToNinePointNine').text(countFineNineToNinePointNine);
                $('#music-countNineToNinePointNine').text(countMusicNineToNinePointNine);
                $('#athletic-countNineToNinePointNine').text(countAthleticNineToNinePointNine);
                $('#rate-countNineToNinePointNine').text(countRateNineToNinePointNine);

                // 10 to 1.99
                $('#arabic-countTenToElevenPointNine').text(countArabicTenToElevenPointNine);
                $('#amazigh-countTenToElevenPointNine').text(countAmazighTenToElevenPointNine);
                $('#french-countTenToElevenPointNine').text(countFrenchTenToElevenPointNine);
                $('#english-countTenToElevenPointNine').text(countEnglishTenToElevenPointNine);
                $('#islamic-countTenToElevenPointNine').text(countIslamicTenToElevenPointNine);
                $('#civics-countTenToElevenPointNine').text(countCivicsTenToElevenPointNine);
                $('#historyandgeography-countTenToElevenPointNine').text(countHistoryGeographyTenToElevenPointNine);
                $('#math-countTenToElevenPointNine').text(countMathTenToElevenPointNine);
                $('#nature-countTenToElevenPointNine').text(countNatureTenToElevenPointNine);
                $('#physical-countTenToElevenPointNine').text(countPhysicalTenToElevenPointNine);
                $('#informatics-countTenToElevenPointNine').text(countInformaticsTenToElevenPointNine);
                $('#fine-countTenToElevenPointNine').text(countFineTenToElevenPointNine);
                $('#music-countTenToElevenPointNine').text(countMusicTenToElevenPointNine);
                $('#athletic-countTenToElevenPointNine').text(countAthleticTenToElevenPointNine);
                $('#rate-countTenToElevenPointNine').text(countRateTenToElevenPointNine);

                // 12 to 13.99
                $('#arabic-countTwelveToThirteenPointNine').text(countArabicTwelveToThirteenPointNine);
                $('#amazigh-countTwelveToThirteenPointNine').text(countAmazighTwelveToThirteenPointNine);
                $('#french-countTwelveToThirteenPointNine').text(countFrenchTwelveToThirteenPointNine);
                $('#english-countTwelveToThirteenPointNine').text(countEnglishTwelveToThirteenPointNine);
                $('#islamic-countTwelveToThirteenPointNine').text(countIslamicTwelveToThirteenPointNine);
                $('#civics-countTwelveToThirteenPointNine').text(countCivicsTwelveToThirteenPointNine);
                $('#historyandgeography-countTwelveToThirteenPointNine').text(countHistoryGeographyTwelveToThirteenPointNine);
                $('#math-countTwelveToThirteenPointNine').text(countMathTwelveToThirteenPointNine);
                $('#nature-countTwelveToThirteenPointNine').text(countNatureTwelveToThirteenPointNine);
                $('#physical-countTwelveToThirteenPointNine').text(countPhysicalTwelveToThirteenPointNine);
                $('#informatics-countTwelveToThirteenPointNine').text(countInformaticsTwelveToThirteenPointNine);
                $('#fine-countTwelveToThirteenPointNine').text(countFineTwelveToThirteenPointNine);
                $('#music-countTwelveToThirteenPointNine').text(countMusicTwelveToThirteenPointNine);
                $('#athletic-countTwelveToThirteenPointNine').text(countAthleticTwelveToThirteenPointNine);
                $('#rate-countTwelveToThirteenPointNine').text(countRateTwelveToThirteenPointNine);

                // 14 to 15.99
                $('#arabic-countFourteenToFifteenPointNine').text(countArabicFourteenToFifteenPointNine);
                $('#amazigh-countFourteenToFifteenPointNine').text(countAmazighFourteenToFifteenPointNine);
                $('#french-countFourteenToFifteenPointNine').text(countFrenchFourteenToFifteenPointNine);
                $('#english-countFourteenToFifteenPointNine').text(countEnglishFourteenToFifteenPointNine);
                $('#islamic-countFourteenToFifteenPointNine').text(countIslamicFourteenToFifteenPointNine);
                $('#civics-countFourteenToFifteenPointNine').text(countCivicsFourteenToFifteenPointNine);
                $('#historyandgeography-countFourteenToFifteenPointNine').text(countHistoryGeographyFourteenToFifteenPointNine);
                $('#math-countFourteenToFifteenPointNine').text(countMathFourteenToFifteenPointNine);
                $('#nature-countFourteenToFifteenPointNine').text(countNatureFourteenToFifteenPointNine);
                $('#physical-countFourteenToFifteenPointNine').text(countPhysicalFourteenToFifteenPointNine);
                $('#informatics-countFourteenToFifteenPointNine').text(countInformaticsFourteenToFifteenPointNine);
                $('#fine-countFourteenToFifteenPointNine').text(countFineFourteenToFifteenPointNine);
                $('#music-countFourteenToFifteenPointNine').text(countMusicFourteenToFifteenPointNine);
                $('#athletic-countFourteenToFifteenPointNine').text(countAthleticFourteenToFifteenPointNine);
                $('#rate-countFourteenToFifteenPointNine').text(countRateFourteenToFifteenPointNine);

                // 16 to 17.99
                $('#arabic-countSixteenToSeventeenPointNine').text(countArabicSixteenToSeventeenPointNine);
                $('#amazigh-countSixteenToSeventeenPointNine').text(countAmazighSixteenToSeventeenPointNine);
                $('#french-countSixteenToSeventeenPointNine').text(countFrenchSixteenToSeventeenPointNine);
                $('#english-countSixteenToSeventeenPointNine').text(countEnglishSixteenToSeventeenPointNine);
                $('#islamic-countSixteenToSeventeenPointNine').text(countIslamicSixteenToSeventeenPointNine);
                $('#civics-countSixteenToSeventeenPointNine').text(countCivicsSixteenToSeventeenPointNine);
                $('#historyandgeography-countSixteenToSeventeenPointNine').text(countHistoryGeographySixteenToSeventeenPointNine);
                $('#math-countSixteenToSeventeenPointNine').text(countMathSixteenToSeventeenPointNine);
                $('#nature-countSixteenToSeventeenPointNine').text(countNatureSixteenToSeventeenPointNine);
                $('#physical-countSixteenToSeventeenPointNine').text(countPhysicalSixteenToSeventeenPointNine);
                $('#informatics-countSixteenToSeventeenPointNine').text(countInformaticsSixteenToSeventeenPointNine);
                $('#fine-countSixteenToSeventeenPointNine').text(countFineSixteenToSeventeenPointNine);
                $('#music-countSixteenToSeventeenPointNine').text(countMusicSixteenToSeventeenPointNine);
                $('#athletic-countSixteenToSeventeenPointNine').text(countAthleticSixteenToSeventeenPointNine);
                $('#rate-countSixteenToSeventeenPointNine').text(countRateSixteenToSeventeenPointNine);

                // 18 to 20
                $('#arabic-countEighteenToTwenty').text(countArabicEighteenToTwenty);
                $('#amazigh-countEighteenToTwenty').text(countAmazighEighteenToTwenty);
                $('#french-countEighteenToTwenty').text(countFrenchEighteenToTwenty);
                $('#english-countEighteenToTwenty').text(countEnglishEighteenToTwenty);
                $('#islamic-countEighteenToTwenty').text(countIslamicEighteenToTwenty);
                $('#civics-countEighteenToTwenty').text(countCivicsEighteenToTwenty);
                $('#historyandgeography-countEighteenToTwenty').text(countHistoryGeographyEighteenToTwenty);
                $('#math-countEighteenToTwenty').text(countMathEighteenToTwenty);
                $('#nature-countEighteenToTwenty').text(countNatureEighteenToTwenty);
                $('#physical-countEighteenToTwenty').text(countPhysicalEighteenToTwenty);
                $('#informatics-countEighteenToTwenty').text(countInformaticsEighteenToTwenty);
                $('#fine-countEighteenToTwenty').text(countFineEighteenToTwenty);
                $('#music-countEighteenToTwenty').text(countMusicEighteenToTwenty);
                $('#athletic-countEighteenToTwenty').text(countAthleticEighteenToTwenty);
                $('#rate-countEighteenToTwenty').text(countRateEighteenToTwenty);


                // Update the HTML elements with the means for each subject
                // 0 to 8.99
                $('#arabic-percentageZeroToEight').text(percentageArabicZeroToEight.toFixed(2) + "%");
                $('#amazigh-percentageZeroToEight').text(percentageAmazighZeroToEight.toFixed(2) + "%");
                $('#french-percentageZeroToEight').text(percentageFrenchZeroToEight.toFixed(2) + "%");
                $('#english-percentageZeroToEight').text(percentageEnglishZeroToEight.toFixed(2) + "%");
                $('#islamic-percentageZeroToEight').text(percentageIslamicZeroToEight.toFixed(2) + "%");
                $('#civics-percentageZeroToEight').text(percentageCivicsZeroToEight.toFixed(2) + "%");
                $('#historyandgeography-percentageZeroToEight').text(percentageHistoryAndGeographyZeroToEight.toFixed(2) + "%");
                $('#math-percentageZeroToEight').text(percentageMathZeroToEight.toFixed(2) + "%");
                $('#nature-percentageZeroToEight').text(percentageNatureZeroToEight.toFixed(2) + "%");
                $('#physical-percentageZeroToEight').text(percentagePhysicalZeroToEight.toFixed(2) + "%");
                $('#informatics-percentageZeroToEight').text(percentageInformaticsZeroToEight.toFixed(2) + "%");
                $('#fine-percentageZeroToEight').text(percentageFineZeroToEight.toFixed(2) + "%");
                $('#music-percentageZeroToEight').text(percentageMusicZeroToEight.toFixed(2) + "%");
                $('#athletic-percentageZeroToEight').text(percentageAthleticZeroToEight.toFixed(2) + "%");
                $('#rate-percentageZeroToEight').text(percentageRateZeroToEight.toFixed(2) + "%");

                // 9 to 9.99
                $('#arabic-percentageNineToNinePointNine').text(percentageArabicNineToNinePointNine.toFixed(2) + "%");
                $('#amazigh-percentageNineToNinePointNine').text(percentageAmazighNineToNinePointNine.toFixed(2) + "%");
                $('#french-percentageNineToNinePointNine').text(percentageFrenchNineToNinePointNine.toFixed(2) + "%");
                $('#english-percentageNineToNinePointNine').text(percentageEnglishNineToNinePointNine.toFixed(2) + "%");
                $('#islamic-percentageNineToNinePointNine').text(percentageIslamicNineToNinePointNine.toFixed(2) + "%");
                $('#civics-percentageNineToNinePointNine').text(percentageCivicsNineToNinePointNine.toFixed(2) + "%");
                $('#historyandgeography-percentageNineToNinePointNine').text(percentageHistoryAndGeographyNineToNinePointNine.toFixed(2) + "%");
                $('#math-percentageNineToNinePointNine').text(percentageMathNineToNinePointNine.toFixed(2) + "%");
                $('#nature-percentageNineToNinePointNine').text(percentageNatureNineToNinePointNine.toFixed(2) + "%");
                $('#physical-percentageNineToNinePointNine').text(percentagePhysicalNineToNinePointNine.toFixed(2) + "%");
                $('#informatics-percentageNineToNinePointNine').text(percentageInformaticsNineToNinePointNine.toFixed(2) + "%");
                $('#fine-percentageNineToNinePointNine').text(percentageFineNineToNinePointNine.toFixed(2) + "%");
                $('#music-percentageNineToNinePointNine').text(percentageMusicNineToNinePointNine.toFixed(2) + "%");
                $('#athletic-percentageNineToNinePointNine').text(percentageAthleticNineToNinePointNine.toFixed(2) + "%");
                $('#rate-percentageNineToNinePointNine').text(percentageRateNineToNinePointNine.toFixed(2) + "%");

                // 10 to 1.99
                $('#arabic-percentageTenToElevenPointNine').text(percentageArabicTenToElevenPointNine.toFixed(2) + "%");
                $('#amazigh-percentageTenToElevenPointNine').text(percentageAmazighTenToElevenPointNine.toFixed(2) + "%");
                $('#french-percentageTenToElevenPointNine').text(percentageFrenchTenToElevenPointNine.toFixed(2) + "%");
                $('#english-percentageTenToElevenPointNine').text(percentageEnglishTenToElevenPointNine.toFixed(2) + "%");
                $('#islamic-percentageTenToElevenPointNine').text(percentageIslamicTenToElevenPointNine.toFixed(2) + "%");
                $('#civics-percentageTenToElevenPointNine').text(percentageCivicsTenToElevenPointNine.toFixed(2) + "%");
                $('#historyandgeography-percentageTenToElevenPointNine').text(percentageHistoryAndGeographyTenToElevenPointNine.toFixed(2) + "%");
                $('#math-percentageTenToElevenPointNine').text(percentageMathTenToElevenPointNine.toFixed(2) + "%");
                $('#nature-percentageTenToElevenPointNine').text(percentageNatureTenToElevenPointNine.toFixed(2) + "%");
                $('#physical-percentageTenToElevenPointNine').text(percentagePhysicalTenToElevenPointNine.toFixed(2) + "%");
                $('#informatics-percentageTenToElevenPointNine').text(percentageInformaticsTenToElevenPointNine.toFixed(2) + "%");
                $('#fine-percentageTenToElevenPointNine').text(percentageFineTenToElevenPointNine.toFixed(2) + "%");
                $('#music-percentageTenToElevenPointNine').text(percentageMusicTenToElevenPointNine.toFixed(2) + "%");
                $('#athletic-percentageTenToElevenPointNine').text(percentageAthleticTenToElevenPointNine.toFixed(2) + "%");
                $('#rate-percentageTenToElevenPointNine').text(percentageRateTenToElevenPointNine.toFixed(2) + "%");

                // 12 to 13.99
                $('#arabic-percentageTwelveToThirteenPointNine').text(percentageArabicTwelveToThirteenPointNine.toFixed(2) + "%");
                $('#amazigh-percentageTwelveToThirteenPointNine').text(percentageAmazighTwelveToThirteenPointNine.toFixed(2) + "%");
                $('#french-percentageTwelveToThirteenPointNine').text(percentageFrenchTwelveToThirteenPointNine.toFixed(2) + "%");
                $('#english-percentageTwelveToThirteenPointNine').text(percentageEnglishTwelveToThirteenPointNine.toFixed(2) + "%");
                $('#islamic-percentageTwelveToThirteenPointNine').text(percentageIslamicTwelveToThirteenPointNine.toFixed(2) + "%");
                $('#civics-percentageTwelveToThirteenPointNine').text(percentageCivicsTwelveToThirteenPointNine.toFixed(2) + "%");
                $('#historyandgeography-percentageTwelveToThirteenPointNine').text(percentageHistoryAndGeographyTwelveToThirteenPointNine.toFixed(2) + "%");
                $('#math-percentageTwelveToThirteenPointNine').text(percentageMathTwelveToThirteenPointNine.toFixed(2) + "%");
                $('#nature-percentageTwelveToThirteenPointNine').text(percentageNatureTwelveToThirteenPointNine.toFixed(2) + "%");
                $('#physical-percentageTwelveToThirteenPointNine').text(percentagePhysicalTwelveToThirteenPointNine.toFixed(2) + "%");
                $('#informatics-percentageTwelveToThirteenPointNine').text(percentageInformaticsTwelveToThirteenPointNine.toFixed(2) + "%");
                $('#fine-percentageTwelveToThirteenPointNine').text(percentageFineTwelveToThirteenPointNine.toFixed(2) + "%");
                $('#music-percentageTwelveToThirteenPointNine').text(percentageMusicTwelveToThirteenPointNine.toFixed(2) + "%");
                $('#athletic-percentageTwelveToThirteenPointNine').text(percentageAthleticTwelveToThirteenPointNine.toFixed(2) + "%");
                $('#rate-percentageTwelveToThirteenPointNine').text(percentageRateTwelveToThirteenPointNine.toFixed(2) + "%");

                // 14 to 15.99
                $('#arabic-percentageFourteenToFifteenPointNine').text(percentageArabicFourteenToFifteenPointNine.toFixed(2) + "%");
                $('#amazigh-percentageFourteenToFifteenPointNine').text(percentageAmazighFourteenToFifteenPointNine.toFixed(2) + "%");
                $('#french-percentageFourteenToFifteenPointNine').text(percentageFrenchFourteenToFifteenPointNine.toFixed(2) + "%");
                $('#english-percentageFourteenToFifteenPointNine').text(percentageEnglishFourteenToFifteenPointNine.toFixed(2) + "%");
                $('#islamic-percentageFourteenToFifteenPointNine').text(percentageIslamicFourteenToFifteenPointNine.toFixed(2) + "%");
                $('#civics-percentageFourteenToFifteenPointNine').text(percentageCivicsFourteenToFifteenPointNine.toFixed(2) + "%");
                $('#historyandgeography-percentageFourteenToFifteenPointNine').text(percentageHistoryAndGeographyFourteenToFifteenPointNine.toFixed(2) + "%");
                $('#math-percentageFourteenToFifteenPointNine').text(percentageMathFourteenToFifteenPointNine.toFixed(2) + "%");
                $('#nature-percentageFourteenToFifteenPointNine').text(percentageNatureFourteenToFifteenPointNine.toFixed(2) + "%");
                $('#physical-percentageFourteenToFifteenPointNine').text(percentagePhysicalFourteenToFifteenPointNine.toFixed(2) + "%");
                $('#informatics-percentageFourteenToFifteenPointNine').text(percentageInformaticsFourteenToFifteenPointNine.toFixed(2) + "%");
                $('#fine-percentageFourteenToFifteenPointNine').text(percentageFineFourteenToFifteenPointNine.toFixed(2) + "%");
                $('#music-percentageFourteenToFifteenPointNine').text(percentageMusicFourteenToFifteenPointNine.toFixed(2) + "%");
                $('#athletic-percentageFourteenToFifteenPointNine').text(percentageAthleticFourteenToFifteenPointNine.toFixed(2) + "%");
                $('#rate-percentageFourteenToFifteenPointNine').text(percentageRateFourteenToFifteenPointNine.toFixed(2) + "%");

                // 16 to 17.99
                $('#arabic-percentageSixteenToSeventeenPointNine').text(percentageArabicSixteenToSeventeenPointNine.toFixed(2) + "%");
                $('#amazigh-percentageSixteenToSeventeenPointNine').text(percentageAmazighSixteenToSeventeenPointNine.toFixed(2) + "%");
                $('#french-percentageSixteenToSeventeenPointNine').text(percentageFrenchSixteenToSeventeenPointNine.toFixed(2) + "%");
                $('#english-percentageSixteenToSeventeenPointNine').text(percentageEnglishSixteenToSeventeenPointNine.toFixed(2) + "%");
                $('#islamic-percentageSixteenToSeventeenPointNine').text(percentageIslamicSixteenToSeventeenPointNine.toFixed(2) + "%");
                $('#civics-percentageSixteenToSeventeenPointNine').text(percentageCivicsSixteenToSeventeenPointNine.toFixed(2) + "%");
                $('#historyandgeography-percentageSixteenToSeventeenPointNine').text(percentageHistoryAndGeographySixteenToSeventeenPointNine.toFixed(2) + "%");
                $('#math-percentageSixteenToSeventeenPointNine').text(percentageMathSixteenToSeventeenPointNine.toFixed(2) + "%");
                $('#nature-percentageSixteenToSeventeenPointNine').text(percentageNatureSixteenToSeventeenPointNine.toFixed(2) + "%");
                $('#physical-percentageSixteenToSeventeenPointNine').text(percentagePhysicalSixteenToSeventeenPointNine.toFixed(2) + "%");
                $('#informatics-percentageSixteenToSeventeenPointNine').text(percentageInformaticsSixteenToSeventeenPointNine.toFixed(2) + "%");
                $('#fine-percentageSixteenToSeventeenPointNine').text(percentageFineSixteenToSeventeenPointNine.toFixed(2) + "%");
                $('#music-percentageSixteenToSeventeenPointNine').text(percentageMusicSixteenToSeventeenPointNine.toFixed(2) + "%");
                $('#athletic-percentageSixteenToSeventeenPointNine').text(percentageAthleticSixteenToSeventeenPointNine.toFixed(2) + "%");
                $('#rate-percentageSixteenToSeventeenPointNine').text(percentageRateSixteenToSeventeenPointNine.toFixed(2) + "%");

                // 18 to 20
                $('#arabic-percentageEighteenToTwenty').text(percentageArabicEighteenToTwenty.toFixed(2) + "%");
                $('#amazigh-percentageEighteenToTwenty').text(percentageAmazighEighteenToTwenty.toFixed(2) + "%");
                $('#french-percentageEighteenToTwenty').text(percentageFrenchEighteenToTwenty.toFixed(2) + "%");
                $('#english-percentageEighteenToTwenty').text(percentageEnglishEighteenToTwenty.toFixed(2) + "%");
                $('#islamic-percentageEighteenToTwenty').text(percentageIslamicEighteenToTwenty.toFixed(2) + "%");
                $('#civics-percentageEighteenToTwenty').text(percentageCivicsEighteenToTwenty.toFixed(2) + "%");
                $('#historyandgeography-percentageEighteenToTwenty').text(percentageHistoryAndGeographyEighteenToTwenty.toFixed(2) + "%");
                $('#math-percentageEighteenToTwenty').text(percentageMathEighteenToTwenty.toFixed(2) + "%");
                $('#nature-percentageEighteenToTwenty').text(percentageNatureEighteenToTwenty.toFixed(2) + "%");
                $('#physical-percentageEighteenToTwenty').text(percentagePhysicalEighteenToTwenty.toFixed(2) + "%");
                $('#informatics-percentageEighteenToTwenty').text(percentageInformaticsEighteenToTwenty.toFixed(2) + "%");
                $('#fine-percentageEighteenToTwenty').text(percentageFineEighteenToTwenty.toFixed(2) + "%");
                $('#music-percentageEighteenToTwenty').text(percentageMusicEighteenToTwenty.toFixed(2) + "%");
                $('#athletic-percentageEighteenToTwenty').text(percentageAthleticEighteenToTwenty.toFixed(2) + "%");
                $('#rate-percentageEighteenToTwenty').text(percentageRateEighteenToTwenty.toFixed(2) + "%");


                // descriptive DataTable
                // Calculate  DataTable for descriptive
                // Initialize counters for each variabel
                let countMale = 0;
                let countFemale = 0;
                let countFailure = 0;
                let countSuccess = 0;

                // Iterate over each row in the table
                table.rows().every(function () {
                    const rowData = this.data();

                    const gendarValue = rowData['الجنس'] || ""; // Get the gender value as a string
                    const FailureValue = rowData['الإعادة'] || ""; // Get the failure value as a string

                    // Male
                    if (gendarValue === "ذكر") {
                        countMale++;
                    }

                    // Female
                    if (gendarValue === "أنثى") {
                        countFemale++;
                    }

                    // Failure
                    if (FailureValue === "نعم") {
                        countFailure++;
                    }

                    // Success
                    if (FailureValue === "لا") {
                        countSuccess++;
                    }

                    // Continue iteration over rows
                    return true;
                });

                // Calculate the percentage of values for each category
                const totalCount = table.rows().count();

                // Gender
                const percentageMale = (countMale / totalCount) * 100;
                const percentageFemale = (countFemale / totalCount) * 100;

                // Failure / Success
                const percentageFailure = (countFailure / totalCount) * 100;
                const percentageSuccess = (countSuccess / totalCount) * 100;

                // Sum
                const sumMaleFemale = countMale + countFemale;
                const percentageMaleFemale = (sumMaleFemale / totalCount) * 100;

                const sumFailureSuccess = countFailure + countSuccess;
                const percentageFailureSuccess = (sumFailureSuccess / totalCount) * 100;

                // Update the HTML elements
                // Gender
                $('#Male-count').text(countMale);
                $('#Female-count').text(countFemale);
                $('#MaleFemale-count').text(sumMaleFemale);

                // Failure / Success
                $('#Failure-count').text(countFailure);
                $('#Success-count').text(countSuccess);
                $('#FailureSuccess-count').text(sumFailureSuccess);

                // Update the HTML elements with the means for each subject
                // Gender
                $('#Male-percentage').text(percentageMale.toFixed(2) + "%");
                $('#Female-percentage').text(percentageFemale.toFixed(2) + "%");
                $('#MaleFemale-percentage').text(percentageMaleFemale.toFixed(2) + "%");

                // Failure / Success
                $('#Failure-percentage').text(percentageFailure.toFixed(2) + "%");
                $('#Success-percentage').text(percentageSuccess.toFixed(2) + "%");
                $('#FailureSuccess-percentage').text(percentageFailureSuccess.toFixed(2) + "%");


                // Adab & ScienceTech DataTable
                // Calculate  DataTable for Adab & ScienceTech
                // Initialize counters for each variabel

                let countAdab = 0;
                let countScienceTech = 0;
                let countAdabMale = 0;
                let countScienceTechMale = 0;
                let countAdabFemale = 0;
                let countScienceTechFemale = 0;

                // Iterate over each row in the table
                table.rows().every(function () {
                    const rowData = this.data();

                    // Calculate the total count of rows
                    const totalCount = table.rows().count();

                    const gender = rowData['الجنس'];
                    const arabic = parseFloat(rowData['اللغة العربية ف 2']) || 0;
                    const french = parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
                    const english = parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
                    const history = parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
                    const scienceTech = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                    const natureLife = parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
                    const mathematics = parseFloat(rowData['الرياضيات ف 2']) || 0;
                    const TCL = ((scienceTech * 4) + (natureLife * 4) + (mathematics * 4) + (arabic * 2)) / 14;
                    const TCT = ((arabic * 5) + (french * 4) + (english * 3) + (history * 2)) / 14;

                    // Count Adab & ScienceTech
                    if (TCT > TCL) {
                        countAdab++;
                    } 
                    if (TCT < TCL) {
                        countScienceTech++;
                    }

                    // Count Adab & ScienceTech Male
                    if (TCT > TCL && gender === 'ذكر') {
                        countAdabMale++;
                    } 
                    if (TCT < TCL && gender === 'ذكر') {
                        countScienceTechMale++;
                    }

                    // Count Adab & ScienceTech Female
                    if (TCT > TCL && gender === 'أنثى') {
                        countAdabFemale++;
                    } 
                    if (TCT < TCL && gender === 'أنثى') {
                        countScienceTechFemale++;
                    }

                    // Continue iteration over rows
                    return true;
                });    

                // Calculate percentages
                const percentageAdab = (countAdab / totalCount) * 100;
                const percentageScienceTech = (countScienceTech / totalCount) * 100;

                // Count Adab & ScienceTech Male
                const percentageAdabMale = (countAdabMale / totalCount) * 100;
                const percentageScienceTechMale = (countScienceTechMale / totalCount) * 100;

                // Count Adab & ScienceTech Female
                const percentageAdabFemale = (countAdabFemale / totalCount) * 100;
                const percentageScienceTechFemale = (countScienceTechFemale / totalCount) * 100;

                // Calculate the sum of counts for both orientations
                const sumAdabScienceTech = countAdab + countScienceTech;
                const percentageAdabScienceTech = (sumAdabScienceTech / totalCount) * 100;

                // Calculate the sum of counts for both orientations Male
                const sumAdabScienceTechMale = countAdabMale + countScienceTechMale;
                const percentageAdabScienceTechMale = (sumAdabScienceTechMale / totalCount) * 100;

                // Calculate the sum of counts for both orientations Female
                const sumAdabScienceTechFemale = countAdabFemale + countScienceTechFemale;
                const percentageAdabScienceTechFemale = (sumAdabScienceTechFemale / totalCount) * 100;


                // Update HTML elements
                $('#countAdab, #countAdab2').text(countAdab);
                $('#countAdabMale').text(countAdabMale);
                $('#countAdabFemale').text(countAdabFemale);

                $('#countScienceTech, #countScienceTech2').text(countScienceTech);
                $('#countScienceTechMale').text(countScienceTechMale);
                $('#countScienceTechFemale').text(countScienceTechFemale);

                $('#countAdabScienceTech, #countAdabScienceTech2').text(sumAdabScienceTech);
                $('#countAdabScienceTechMale').text(sumAdabScienceTechMale);
                $('#countAdabScienceTechFemale').text(sumAdabScienceTechFemale);

                $('#percentageAdab, #percentageAdab2').text(percentageAdab.toFixed(2) + "%");
                $('#percentageAdabMale').text(percentageAdabMale.toFixed(2) + "%");
                $('#percentageAdabFemale').text(percentageAdabFemale.toFixed(2) + "%");

                $('#percentageScienceTech, #percentageScienceTech2').text(percentageScienceTech.toFixed(2) + "%");
                $('#percentageScienceTechMale').text(percentageScienceTechMale.toFixed(2) + "%");
                $('#percentageScienceTechFemale').text(percentageScienceTechFemale.toFixed(2) + "%");

                $('#percentageAdabScienceTech, #percentageAdabScienceTech2').text(percentageAdabScienceTech.toFixed(2) + "%");
                $('#percentageAdabScienceTechMale').text(percentageAdabScienceTechMale.toFixed(2) + "%");
                $('#percentageAdabScienceTechFemale').text(percentageAdabScienceTechFemale.toFixed(2) + "%");


                // Qualitative indicators of success DataTable
                // Calculate  DataTable for Qualitative indicators of success
                // Initialize counters for each variabel
                let countAbove18 = 0;
                let countBetween15And17 = 0;
                let countBetween14And14_99 = 0;
                let countBetween12And13_99 = 0;
                let countBelow12 = 0;
                

                // Iterate over each row in the table
                table.rows().every(function () {
                    const rowData = this.data();
                    
                    // Calculate the total count
                    const totalCount = table.rows().count();

                    const rateValue = parseFloat(rowData['معدل الفصل 2']) || 0;

                    if (rateValue >= 18) {
                        countAbove18++;
                    } else if (rateValue >= 15 && rateValue <= 17.99) {
                        countBetween15And17++;
                    } else if (rateValue >= 14 && rateValue <= 14.99) {
                        countBetween14And14_99++;
                    } else if (rateValue >= 12 && rateValue <= 13.99) {
                        countBetween12And13_99++;
                    } else {
                        countBelow12++;
                    }

                    // Continue iteration over rows
                    return true;
                });

                

                // Calculate percentages
                const totalindicators = countAbove18 + countBetween15And17 + countBetween14And14_99 + countBetween12And13_99 + countBelow12;
                const percentageAbove18 = (countAbove18 / totalCount) * 100;
                const percentageBetween15And17 = (countBetween15And17 / totalCount) * 100;
                const percentageBetween14And14_99 = (countBetween14And14_99 / totalCount) * 100;
                const percentageBetween12And13_99 = (countBetween12And13_99 / totalCount) * 100;
                const percentageBelow12 = (countBelow12 / totalCount) * 100;
                const percentagetotalindicators = (totalindicators / totalCount) * 100;

                // Update HTML elements
                $('#countAbove18').text(countAbove18);
                $('#countBetween15And17').text(countBetween15And17);
                $('#countBetween14And14_99').text(countBetween14And14_99);
                $('#countBetween12And13_99').text(countBetween12And13_99);
                $('#countBelow12').text(countBelow12);
                $('#totalindicators').text(totalindicators);

                // Update HTML elements with percentages
                $('#percentageAbove18').text(percentageAbove18.toFixed(2) + "%");
                $('#percentageBetween15And17').text(percentageBetween15And17.toFixed(2) + "%");
                $('#percentageBetween14And14_99').text(percentageBetween14And14_99.toFixed(2) + "%");
                $('#percentageBetween12And13_99').text(percentageBetween12And13_99.toFixed(2) + "%");
                $('#percentageBelow12').text(percentageBelow12.toFixed(2) + "%");
                $('#percentagetotalindicators').text(percentagetotalindicators.toFixed(2) + "%");


                // Ranking academic achievement DataTable
                // Ranking of classes according to academic achievement
                // Initialize counters for each subject

                 // Initialize variables to hold the sum of values for each subject
                
                let sumArabicM1 = 0, sumArabicM2 = 0, sumArabicM3 = 0, sumArabicM4 = 0, sumArabicM5 = 0, sumArabicM6 = 0, sumArabicM7 = 0, sumArabicM8 = 0, sumArabicM9 = 0, sumArabicM10 = 0;
                let sumAmazighM1 = 0, sumAmazighM2 = 0, sumAmazighM3 = 0, sumAmazighM4 = 0, sumAmazighM5 = 0, sumAmazighM6 = 0, sumAmazighM7 = 0, sumAmazighM8 = 0, sumAmazighM9 = 0, sumAmazighM10 = 0;
                let sumFrenchM1 = 0, sumFrenchM2 = 0, sumFrenchM3 = 0, sumFrenchM4 = 0, sumFrenchM5 = 0, sumFrenchM6 = 0, sumFrenchM7 = 0, sumFrenchM8 = 0, sumFrenchM9 = 0, sumFrenchM10 = 0;
                let sumEnglishM1 = 0, sumEnglishM2 = 0, sumEnglishM3 = 0, sumEnglishM4 = 0, sumEnglishM5 = 0, sumEnglishM6 = 0, sumEnglishM7 = 0, sumEnglishM8 = 0, sumEnglishM9 = 0, sumEnglishM10 = 0;
                let sumIslamicM1 = 0, sumIslamicM2 = 0, sumIslamicM3 = 0, sumIslamicM4 = 0, sumIslamicM5 = 0, sumIslamicM6 = 0, sumIslamicM7 = 0, sumIslamicM8 = 0, sumIslamicM9 = 0, sumIslamicM10 = 0;
                let sumCivicsM1 = 0, sumCivicsM2 = 0, sumCivicsM3 = 0, sumCivicsM4 = 0, sumCivicsM5 = 0, sumCivicsM6 = 0, sumCivicsM7 = 0, sumCivicsM8 = 0, sumCivicsM9 = 0, sumCivicsM10 = 0;
                let sumHistoryGeographyM1 = 0, sumHistoryGeographyM2 = 0, sumHistoryGeographyM3 = 0, sumHistoryGeographyM4 = 0, sumHistoryGeographyM5 = 0, sumHistoryGeographyM6 = 0, sumHistoryGeographyM7 = 0, sumHistoryGeographyM8 = 0, sumHistoryGeographyM9 = 0, sumHistoryGeographyM10 = 0;
                let sumMathM1 = 0, sumMathM2 = 0, sumMathM3 = 0, sumMathM4 = 0, sumMathM5 = 0, sumMathM6 = 0, sumMathM7 = 0, sumMathM8 = 0, sumMathM9 = 0, sumMathM10 = 0;
                let sumNatureM1 = 0, sumNatureM2 = 0, sumNatureM3 = 0, sumNatureM4 = 0, sumNatureM5 = 0, sumNatureM6 = 0, sumNatureM7 = 0, sumNatureM8 = 0, sumNatureM9 = 0, sumNatureM10 = 0;
                let sumPhysicalM1 = 0, sumPhysicalM2 = 0, sumPhysicalM3 = 0, sumPhysicalM4 = 0, sumPhysicalM5 = 0, sumPhysicalM6 = 0, sumPhysicalM7 = 0, sumPhysicalM8 = 0, sumPhysicalM9 = 0, sumPhysicalM10 = 0;
                let sumInformaticsM1 = 0, sumInformaticsM2 = 0, sumInformaticsM3 = 0, sumInformaticsM4 = 0, sumInformaticsM5 = 0, sumInformaticsM6 = 0, sumInformaticsM7 = 0, sumInformaticsM8 = 0, sumInformaticsM9 = 0, sumInformaticsM10 = 0;
                let sumFineM1 = 0, sumFineM2 = 0, sumFineM3 = 0, sumFineM4 = 0, sumFineM5 = 0, sumFineM6 = 0, sumFineM7 = 0, sumFineM8 = 0, sumFineM9 = 0, sumFineM10 = 0;
                let sumMusicM1 = 0, sumMusicM2 = 0, sumMusicM3 = 0, sumMusicM4 = 0, sumMusicM5 = 0, sumMusicM6 = 0, sumMusicM7 = 0, sumMusicM8 = 0, sumMusicM9 = 0, sumMusicM10 = 0;
                let sumAthleticM1 = 0, sumAthleticM2 = 0, sumAthleticM3 = 0, sumAthleticM4 = 0, sumAthleticM5 = 0, sumAthleticM6 = 0, sumAthleticM7 = 0, sumAthleticM8 = 0, sumAthleticM9 = 0, sumAthleticM10 = 0;
                let sumRateM1 = 0, sumRateM2 = 0, sumRateM3 = 0, sumRateM4 = 0, sumRateM5 = 0, sumRateM6 = 0, sumRateM7 = 0, sumRateM8 = 0, sumRateM9 = 0, sumRateM10 = 0;

                 // Initialize variables to hold the count of values for each subject
                let countArabicM1 = 0, countArabicM2 = 0, countArabicM3 = 0, countArabicM4 = 0, countArabicM5 = 0, countArabicM6 = 0, countArabicM7 = 0, countArabicM8 = 0, countArabicM9 = 0, countArabicM10 = 0;
                let countAmazighM1 = 0, countAmazighM2 = 0, countAmazighM3 = 0, countAmazighM4 = 0, countAmazighM5 = 0, countAmazighM6 = 0, countAmazighM7 = 0, countAmazighM8 = 0, countAmazighM9 = 0, countAmazighM10 = 0;
                let countFrenchM1 = 0, countFrenchM2 = 0, countFrenchM3 = 0, countFrenchM4 = 0, countFrenchM5 = 0, countFrenchM6 = 0, countFrenchM7 = 0, countFrenchM8 = 0, countFrenchM9 = 0, countFrenchM10 = 0;
                let countEnglishM1 = 0, countEnglishM2 = 0, countEnglishM3 = 0, countEnglishM4 = 0, countEnglishM5 = 0, countEnglishM6 = 0, countEnglishM7 = 0, countEnglishM8 = 0, countEnglishM9 = 0, countEnglishM10 = 0;
                let countIslamicM1 = 0, countIslamicM2 = 0, countIslamicM3 = 0, countIslamicM4 = 0, countIslamicM5 = 0, countIslamicM6 = 0, countIslamicM7 = 0, countIslamicM8 = 0, countIslamicM9 = 0, countIslamicM10 = 0;
                let countCivicsM1 = 0, countCivicsM2 = 0, countCivicsM3 = 0, countCivicsM4 = 0, countCivicsM5 = 0, countCivicsM6 = 0, countCivicsM7 = 0, countCivicsM8 = 0, countCivicsM9 = 0, countCivicsM10 = 0;
                let countHistoryGeographyM1 = 0, countHistoryGeographyM2 = 0, countHistoryGeographyM3 = 0, countHistoryGeographyM4 = 0, countHistoryGeographyM5 = 0, countHistoryGeographyM6 = 0, countHistoryGeographyM7 = 0, countHistoryGeographyM8 = 0, countHistoryGeographyM9 = 0, countHistoryGeographyM10 = 0;
                let countMathM1 = 0, countMathM2 = 0, countMathM3 = 0, countMathM4 = 0, countMathM5 = 0, countMathM6 = 0, countMathM7 = 0, countMathM8 = 0, countMathM9 = 0, countMathM10 = 0;
                let countNatureM1 = 0, countNatureM2 = 0, countNatureM3 = 0, countNatureM4 = 0, countNatureM5 = 0, countNatureM6 = 0, countNatureM7 = 0, countNatureM8 = 0, countNatureM9 = 0, countNatureM10 = 0;
                let countPhysicalM1 = 0, countPhysicalM2 = 0, countPhysicalM3 = 0, countPhysicalM4 = 0, countPhysicalM5 = 0, countPhysicalM6 = 0, countPhysicalM7 = 0, countPhysicalM8 = 0, countPhysicalM9 = 0, countPhysicalM10 = 0;
                let countInformaticsM1 = 0, countInformaticsM2 = 0, countInformaticsM3 = 0, countInformaticsM4 = 0, countInformaticsM5 = 0, countInformaticsM6 = 0, countInformaticsM7 = 0, countInformaticsM8 = 0, countInformaticsM9 = 0, countInformaticsM10 = 0;
                let countFineM1 = 0, countFineM2 = 0, countFineM3 = 0, countFineM4 = 0, countFineM5 = 0, countFineM6 = 0, countFineM7 = 0, countFineM8 = 0, countFineM9 = 0, countFineM10 = 0;
                let countMusicM1 = 0, countMusicM2 = 0, countMusicM3 = 0, countMusicM4 = 0, countMusicM5 = 0, countMusicM6 = 0, countMusicM7 = 0, countMusicM8 = 0, countMusicM9 = 0, countMusicM10 = 0;
                let countAthleticM1 = 0, countAthleticM2 = 0, countAthleticM3 = 0, countAthleticM4 = 0, countAthleticM5 = 0, countAthleticM6 = 0, countAthleticM7 = 0, countAthleticM8 = 0, countAthleticM9 = 0, countAthleticM10 = 0;
                let countRateM1 = 0, countRateM2 = 0, countRateM3 = 0, countRateM4 = 0, countRateM5 = 0, countRateM6 = 0, countRateM7 = 0, countRateM8 = 0, countRateM9 = 0, countRateM10 = 0;

                // Iterate over each row in the table
                table.rows().every(function() {
                    const rowData = this.data();

                    const classeValue = rowData['القسم'];

                    const arabicValue = parseFloat(rowData['اللغة العربية ف 2']) || 0;
                    const amazighValue = parseFloat(rowData['اللغة اﻷمازيغية ف 2']) || 0;
                    const frenchValue = parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
                    const englishValue = parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
                    const islamicValue = parseFloat(rowData['التربية الإسلامية ف 2']) || 0;
                    const civicsValue = parseFloat(rowData['التربية المدنية ف 2']) || 0;
                    const historyGeographyValue = parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
                    const mathValue = parseFloat(rowData['الرياضيات ف 2']) || 0;
                    const natureValue = parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
                    const physicalValue = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                    const informaticsValue = parseFloat(rowData['المعلوماتية ف 2']) || 0;
                    const fineValue = parseFloat(rowData['التربية التشكيلية ف 2']) || 0;
                    const musicValue = parseFloat(rowData['التربية الموسيقية ف 2']) || 0;
                    const athleticValue = parseFloat(rowData['ت البدنية و الرياضية ف 2']) || 0;
                    const rateValue = parseFloat(rowData['معدل الفصل 2']) || 0;

                    //M1
                    if (classeValue === "01") {
                        sumArabicM1 += arabicValue;
                        countArabicM1++;
                    }
                    if (classeValue === "01") {
                        sumAmazighM1 += amazighValue;
                        countAmazighM1++;
                    }
                    if (classeValue === "01") {
                        sumFrenchM1 += frenchValue;
                        countFrenchM1++;
                    }
                    if (classeValue === "01") {
                        sumEnglishM1 += englishValue;
                        countEnglishM1++;
                    }
                    if (classeValue === "01") {
                        sumIslamicM1 += islamicValue;
                        countIslamicM1++;
                    }
                    if (classeValue === "01") {
                        sumCivicsM1 += civicsValue;
                        countCivicsM1++;
                    }
                    if (classeValue === "01") {
                        sumHistoryGeographyM1 += historyGeographyValue;
                        countHistoryGeographyM1++;
                    }
                    if (classeValue === "01") {
                        sumMathM1 += mathValue;
                        countMathM1++;
                    }
                    if (classeValue === "01") {
                        sumNatureM1 += natureValue;
                        countNatureM1++;
                    }
                    if (classeValue === "01") {
                        sumPhysicalM1 += physicalValue;
                        countPhysicalM1++;
                    }
                    if (classeValue === "01") {
                        sumInformaticsM1 += informaticsValue;
                        countInformaticsM1++;
                    }
                    if (classeValue === "01") {
                        sumFineM1 += fineValue;
                        countFineM1++;
                    }
                    if (classeValue === "01") {
                        sumMusicM1 += musicValue;
                        countMusicM1++;
                    }
                    if (classeValue === "01") {
                        sumAthleticM1 += athleticValue;
                        countAthleticM1++;
                    }
                    if (classeValue === "01") {
                        sumRateM1 += rateValue;
                        countRateM1++;
                    }

                    //M2
                    if (classeValue === "02") {
                        sumArabicM2 += arabicValue;
                        countArabicM2++;
                    }
                    if (classeValue === "02") {
                        sumAmazighM2 += amazighValue;
                        countAmazighM2++;
                    }
                    if (classeValue === "02") {
                        sumFrenchM2 += frenchValue;
                        countFrenchM2++;
                    }
                    if (classeValue === "02") {
                        sumEnglishM2 += englishValue;
                        countEnglishM2++;
                    }
                    if (classeValue === "02") {
                        sumIslamicM2 += islamicValue;
                        countIslamicM2++;
                    }
                    if (classeValue === "02") {
                        sumCivicsM2 += civicsValue;
                        countCivicsM2++;
                    }
                    if (classeValue === "02") {
                        sumHistoryGeographyM2 += historyGeographyValue;
                        countHistoryGeographyM2++;
                    }
                    if (classeValue === "02") {
                        sumMathM2 += mathValue;
                        countMathM2++;
                    }
                    if (classeValue === "02") {
                        sumNatureM2 += natureValue;
                        countNatureM2++;
                    }
                    if (classeValue === "02") {
                        sumPhysicalM2 += physicalValue;
                        countPhysicalM2++;
                    }
                    if (classeValue === "02") {
                        sumInformaticsM2 += informaticsValue;
                        countInformaticsM2++;
                    }
                    if (classeValue === "02") {
                        sumFineM2 += fineValue;
                        countFineM2++;
                    }
                    if (classeValue === "02") {
                        sumMusicM2 += musicValue;
                        countMusicM2++;
                    }
                    if (classeValue === "02") {
                        sumAthleticM2 += athleticValue;
                        countAthleticM2++;
                    }
                    if (classeValue === "02") {
                        sumRateM2 += rateValue;
                        countRateM2++;
                    }

                    //M3
                    if (classeValue === "03") {
                        sumArabicM3 += arabicValue;
                        countArabicM3++;
                    }
                    if (classeValue === "03") {
                        sumAmazighM3 += amazighValue;
                        countAmazighM3++;
                    }
                    if (classeValue === "03") {
                        sumFrenchM3 += frenchValue;
                        countFrenchM3++;
                    }
                    if (classeValue === "03") {
                        sumEnglishM3 += englishValue;
                        countEnglishM3++;
                    }
                    if (classeValue === "03") {
                        sumIslamicM3 += islamicValue;
                        countIslamicM3++;
                    }
                    if (classeValue === "03") {
                        sumCivicsM3 += civicsValue;
                        countCivicsM3++;
                    }
                    if (classeValue === "03") {
                        sumHistoryGeographyM3 += historyGeographyValue;
                        countHistoryGeographyM3++;
                    }
                    if (classeValue === "03") {
                        sumMathM3 += mathValue;
                        countMathM3++;
                    }
                    if (classeValue === "03") {
                        sumNatureM3 += natureValue;
                        countNatureM3++;
                    }
                    if (classeValue === "03") {
                        sumPhysicalM3 += physicalValue;
                        countPhysicalM3++;
                    }
                    if (classeValue === "03") {
                        sumInformaticsM3 += informaticsValue;
                        countInformaticsM3++;
                    }
                    if (classeValue === "03") {
                        sumFineM3 += fineValue;
                        countFineM3++;
                    }
                    if (classeValue === "03") {
                        sumMusicM3 += musicValue;
                        countMusicM3++;
                    }
                    if (classeValue === "03") {
                        sumAthleticM3 += athleticValue;
                        countAthleticM3++;
                    }
                    if (classeValue === "03") {
                        sumRateM3 += rateValue;
                        countRateM3++;
                    }

                    //M4
                    if (classeValue === "04") {
                        sumArabicM4 += arabicValue;
                        countArabicM4++;
                    }
                    if (classeValue === "04") {
                        sumAmazighM4 += amazighValue;
                        countAmazighM4++;
                    }
                    if (classeValue === "04") {
                        sumFrenchM4 += frenchValue;
                        countFrenchM4++;
                    }
                    if (classeValue === "04") {
                        sumEnglishM4 += englishValue;
                        countEnglishM4++;
                    }
                    if (classeValue === "04") {
                        sumIslamicM4 += islamicValue;
                        countIslamicM4++;
                    }
                    if (classeValue === "04") {
                        sumCivicsM4 += civicsValue;
                        countCivicsM4++;
                    }
                    if (classeValue === "04") {
                        sumHistoryGeographyM4 += historyGeographyValue;
                        countHistoryGeographyM4++;
                    }
                    if (classeValue === "04") {
                        sumMathM4 += mathValue;
                        countMathM4++;
                    }
                    if (classeValue === "04") {
                        sumNatureM4 += natureValue;
                        countNatureM4++;
                    }
                    if (classeValue === "04") {
                        sumPhysicalM4 += physicalValue;
                        countPhysicalM4++;
                    }
                    if (classeValue === "04") {
                        sumInformaticsM4 += informaticsValue;
                        countInformaticsM4++;
                    }
                    if (classeValue === "04") {
                        sumFineM4 += fineValue;
                        countFineM4++;
                    }
                    if (classeValue === "04") {
                        sumMusicM4 += musicValue;
                        countMusicM4++;
                    }
                    if (classeValue === "04") {
                        sumAthleticM4 += athleticValue;
                        countAthleticM4++;
                    }
                    if (classeValue === "04") {
                        sumRateM4 += rateValue;
                        countRateM4++;
                    }

                    //M5
                    if (classeValue === "05") {
                        sumArabicM5 += arabicValue;
                        countArabicM5++;
                    }
                    if (classeValue === "05") {
                        sumAmazighM5 += amazighValue;
                        countAmazighM5++;
                    }
                    if (classeValue === "05") {
                        sumFrenchM5 += frenchValue;
                        countFrenchM5++;
                    }
                    if (classeValue === "05") {
                        sumEnglishM5 += englishValue;
                        countEnglishM5++;
                    }
                    if (classeValue === "05") {
                        sumIslamicM5 += islamicValue;
                        countIslamicM5++;
                    }
                    if (classeValue === "05") {
                        sumCivicsM5 += civicsValue;
                        countCivicsM5++;
                    }
                    if (classeValue === "05") {
                        sumHistoryGeographyM5 += historyGeographyValue;
                        countHistoryGeographyM5++;
                    }
                    if (classeValue === "05") {
                        sumMathM5 += mathValue;
                        countMathM5++;
                    }
                    if (classeValue === "05") {
                        sumNatureM5 += natureValue;
                        countNatureM5++;
                    }
                    if (classeValue === "05") {
                        sumPhysicalM5 += physicalValue;
                        countPhysicalM5++;
                    }
                    if (classeValue === "05") {
                        sumInformaticsM5 += informaticsValue;
                        countInformaticsM5++;
                    }
                    if (classeValue === "05") {
                        sumFineM5 += fineValue;
                        countFineM5++;
                    }
                    if (classeValue === "05") {
                        sumMusicM5 += musicValue;
                        countMusicM5++;
                    }
                    if (classeValue === "05") {
                        sumAthleticM5 += athleticValue;
                        countAthleticM5++;
                    }
                    if (classeValue === "05") {
                        sumRateM5 += rateValue;
                        countRateM5++;
                    }

                    //M6
                    if (classeValue === "06") {
                        sumArabicM6 += arabicValue;
                        countArabicM6++;
                    }
                    if (classeValue === "06") {
                        sumAmazighM6 += amazighValue;
                        countAmazighM6++;
                    }
                    if (classeValue === "06") {
                        sumFrenchM6 += frenchValue;
                        countFrenchM6++;
                    }
                    if (classeValue === "06") {
                        sumEnglishM6 += englishValue;
                        countEnglishM6++;
                    }
                    if (classeValue === "06") {
                        sumIslamicM6 += islamicValue;
                        countIslamicM6++;
                    }
                    if (classeValue === "06") {
                        sumCivicsM6 += civicsValue;
                        countCivicsM6++;
                    }
                    if (classeValue === "06") {
                        sumHistoryGeographyM6 += historyGeographyValue;
                        countHistoryGeographyM6++;
                    }
                    if (classeValue === "06") {
                        sumMathM6 += mathValue;
                        countMathM6++;
                    }
                    if (classeValue === "06") {
                        sumNatureM6 += natureValue;
                        countNatureM6++;
                    }
                    if (classeValue === "06") {
                        sumPhysicalM6 += physicalValue;
                        countPhysicalM6++;
                    }
                    if (classeValue === "06") {
                        sumInformaticsM6 += informaticsValue;
                        countInformaticsM6++;
                    }
                    if (classeValue === "06") {
                        sumFineM6 += fineValue;
                        countFineM6++;
                    }
                    if (classeValue === "06") {
                        sumMusicM6 += musicValue;
                        countMusicM6++;
                    }
                    if (classeValue === "06") {
                        sumAthleticM6 += athleticValue;
                        countAthleticM6++;
                    }
                    if (classeValue === "06") {
                        sumRateM6 += rateValue;
                        countRateM6++;
                    }

                    //M7
                    if (classeValue === "07") {
                        sumArabicM7 += arabicValue;
                        countArabicM7++;
                    }
                    if (classeValue === "07") {
                        sumAmazighM7 += amazighValue;
                        countAmazighM7++;
                    }
                    if (classeValue === "07") {
                        sumFrenchM7 += frenchValue;
                        countFrenchM7++;
                    }
                    if (classeValue === "07") {
                        sumEnglishM7 += englishValue;
                        countEnglishM7++;
                    }
                    if (classeValue === "07") {
                        sumIslamicM7 += islamicValue;
                        countIslamicM7++;
                    }
                    if (classeValue === "07") {
                        sumCivicsM7 += civicsValue;
                        countCivicsM7++;
                    }
                    if (classeValue === "07") {
                        sumHistoryGeographyM7 += historyGeographyValue;
                        countHistoryGeographyM7++;
                    }
                    if (classeValue === "07") {
                        sumMathM7 += mathValue;
                        countMathM7++;
                    }
                    if (classeValue === "07") {
                        sumNatureM7 += natureValue;
                        countNatureM7++;
                    }
                    if (classeValue === "07") {
                        sumPhysicalM7 += physicalValue;
                        countPhysicalM7++;
                    }
                    if (classeValue === "07") {
                        sumInformaticsM7 += informaticsValue;
                        countInformaticsM7++;
                    }
                    if (classeValue === "07") {
                        sumFineM7 += fineValue;
                        countFineM7++;
                    }
                    if (classeValue === "07") {
                        sumMusicM7 += musicValue;
                        countMusicM7++;
                    }
                    if (classeValue === "07") {
                        sumAthleticM7 += athleticValue;
                        countAthleticM7++;
                    }
                    if (classeValue === "07") {
                        sumRateM7 += rateValue;
                        countRateM7++;
                    }

                    //M8
                    if (classeValue === "08") {
                        sumArabicM8 += arabicValue;
                        countArabicM8++;
                    }
                    if (classeValue === "08") {
                        sumAmazighM8 += amazighValue;
                        countAmazighM8++;
                    }
                    if (classeValue === "08") {
                        sumFrenchM8 += frenchValue;
                        countFrenchM8++;
                    }
                    if (classeValue === "08") {
                        sumEnglishM8 += englishValue;
                        countEnglishM8++;
                    }
                    if (classeValue === "08") {
                        sumIslamicM8 += islamicValue;
                        countIslamicM8++;
                    }
                    if (classeValue === "08") {
                        sumCivicsM8 += civicsValue;
                        countCivicsM8++;
                    }
                    if (classeValue === "08") {
                        sumHistoryGeographyM8 += historyGeographyValue;
                        countHistoryGeographyM8++;
                    }
                    if (classeValue === "08") {
                        sumMathM8 += mathValue;
                        countMathM8++;
                    }
                    if (classeValue === "08") {
                        sumNatureM8 += natureValue;
                        countNatureM8++;
                    }
                    if (classeValue === "08") {
                        sumPhysicalM8 += physicalValue;
                        countPhysicalM8++;
                    }
                    if (classeValue === "08") {
                        sumInformaticsM8 += informaticsValue;
                        countInformaticsM8++;
                    }
                    if (classeValue === "08") {
                        sumFineM8 += fineValue;
                        countFineM8++;
                    }
                    if (classeValue === "08") {
                        sumMusicM8 += musicValue;
                        countMusicM8++;
                    }
                    if (classeValue === "08") {
                        sumAthleticM8 += athleticValue;
                        countAthleticM8++;
                    }
                    if (classeValue === "08") {
                        sumRateM8 += rateValue;
                        countRateM8++;
                    }

                    //M9
                    if (classeValue === "09") {
                        sumArabicM9 += arabicValue;
                        countArabicM9++;
                    }
                    if (classeValue === "09") {
                        sumAmazighM9 += amazighValue;
                        countAmazighM9++;
                    }
                    if (classeValue === "09") {
                        sumFrenchM9 += frenchValue;
                        countFrenchM9++;
                    }
                    if (classeValue === "09") {
                        sumEnglishM9 += englishValue;
                        countEnglishM9++;
                    }
                    if (classeValue === "09") {
                        sumIslamicM9 += islamicValue;
                        countIslamicM9++;
                    }
                    if (classeValue === "09") {
                        sumCivicsM9 += civicsValue;
                        countCivicsM9++;
                    }
                    if (classeValue === "09") {
                        sumHistoryGeographyM9 += historyGeographyValue;
                        countHistoryGeographyM9++;
                    }
                    if (classeValue === "09") {
                        sumMathM9 += mathValue;
                        countMathM9++;
                    }
                    if (classeValue === "09") {
                        sumNatureM9 += natureValue;
                        countNatureM9++;
                    }
                    if (classeValue === "09") {
                        sumPhysicalM9 += physicalValue;
                        countPhysicalM9++;
                    }
                    if (classeValue === "09") {
                        sumInformaticsM9 += informaticsValue;
                        countInformaticsM9++;
                    }
                    if (classeValue === "09") {
                        sumFineM9 += fineValue;
                        countFineM9++;
                    }
                    if (classeValue === "09") {
                        sumMusicM9 += musicValue;
                        countMusicM9++;
                    }
                    if (classeValue === "09") {
                        sumAthleticM9 += athleticValue;
                        countAthleticM9++;
                    }
                    if (classeValue === "09") {
                        sumRateM9 += rateValue;
                        countRateM9++;
                    }

                    //M10
                    if (classeValue === "10") {
                        sumArabicM10 += arabicValue;
                        countArabicM10++;
                    }
                    if (classeValue === "10") {
                        sumAmazighM10 += amazighValue;
                        countAmazighM10++;
                    }
                    if (classeValue === "10") {
                        sumFrenchM10 += frenchValue;
                        countFrenchM10++;
                    }
                    if (classeValue === "10") {
                        sumEnglishM10 += englishValue;
                        countEnglishM10++;
                    }
                    if (classeValue === "10") {
                        sumIslamicM10 += islamicValue;
                        countIslamicM10++;
                    }
                    if (classeValue === "10") {
                        sumCivicsM10 += civicsValue;
                        countCivicsM10++;
                    }
                    if (classeValue === "10") {
                        sumHistoryGeographyM10 += historyGeographyValue;
                        countHistoryGeographyM10++;
                    }
                    if (classeValue === "10") {
                        sumMathM10 += mathValue;
                        countMathM10++;
                    }
                    if (classeValue === "10") {
                        sumNatureM10 += natureValue;
                        countNatureM10++;
                    }
                    if (classeValue === "10") {
                        sumPhysicalM10 += physicalValue;
                        countPhysicalM10++;
                    }
                    if (classeValue === "10") {
                        sumInformaticsM10 += informaticsValue;
                        countInformaticsM10++;
                    }
                    if (classeValue === "10") {
                        sumFineM10 += fineValue;
                        countFineM10++;
                    }
                    if (classeValue === "10") {
                        sumMusicM10 += musicValue;
                        countMusicM10++;
                    }
                    if (classeValue === "10") {
                        sumAthleticM10 += athleticValue;
                        countAthleticM10++;
                    }
                    if (classeValue === "10") {
                        sumRateM10 += rateValue;
                        countRateM10++;
                    }

                    return true;
                });
                
                // Calculate mean M1
                const meanArabicM1 = countArabicM1 > 0 ? sumArabicM1 / countArabicM1 : 0;
                const meanAmazighM1 = countAmazighM1 > 0 ? sumAmazighM1 / countAmazighM1 : 0;
                const meanFrenchM1 = countFrenchM1 > 0 ? sumFrenchM1 / countFrenchM1 : 0;
                const meanEnglishM1 = countEnglishM1 > 0 ? sumEnglishM1 / countEnglishM1 : 0;
                const meanIslamicM1 = countIslamicM1 > 0 ? sumIslamicM1 / countIslamicM1 : 0;
                const meanCivicsM1 = countCivicsM1 > 0 ? sumCivicsM1 / countCivicsM1 : 0;
                const meanHistoryGeographyM1 = countHistoryGeographyM1 > 0 ? sumHistoryGeographyM1 / countHistoryGeographyM1 : 0;
                const meanMathM1 = countMathM1 > 0 ? sumMathM1 / countMathM1 : 0;
                const meanNatureM1 = countNatureM1 > 0 ? sumNatureM1 / countNatureM1 : 0;
                const meanPhysicalM1 = countPhysicalM1 > 0 ? sumPhysicalM1 / countPhysicalM1 : 0;
                const meanInformaticsM1 = countInformaticsM1 > 0 ? sumInformaticsM1 / countInformaticsM1 : 0;
                const meanFineM1 = countFineM1 > 0 ? sumFineM1 / countFineM1 : 0;
                const meanMusicM1 = countMusicM1 > 0 ? sumMusicM1 / countMusicM1 : 0;
                const meanAthleticM1 = countAthleticM1 > 0 ? sumAthleticM1 / countAthleticM1 : 0;
                const meanRateM1 = countRateM1 > 0 ? sumRateM1 / countRateM1 : 0;

                // Calculate mean M2
                const meanArabicM2 = countArabicM2 > 0 ? sumArabicM2 / countArabicM2 : 0;
                const meanAmazighM2 = countAmazighM2 > 0 ? sumAmazighM2 / countAmazighM2 : 0;
                const meanFrenchM2 = countFrenchM2 > 0 ? sumFrenchM2 / countFrenchM2 : 0;
                const meanEnglishM2 = countEnglishM2 > 0 ? sumEnglishM2 / countEnglishM2 : 0;
                const meanIslamicM2 = countIslamicM2 > 0 ? sumIslamicM2 / countIslamicM2 : 0;
                const meanCivicsM2 = countCivicsM2 > 0 ? sumCivicsM2 / countCivicsM2 : 0;
                const meanHistoryGeographyM2 = countHistoryGeographyM2 > 0 ? sumHistoryGeographyM2 / countHistoryGeographyM2 : 0;
                const meanMathM2 = countMathM2 > 0 ? sumMathM2 / countMathM2 : 0;
                const meanNatureM2 = countNatureM2 > 0 ? sumNatureM2 / countNatureM2 : 0;
                const meanPhysicalM2 = countPhysicalM2 > 0 ? sumPhysicalM2 / countPhysicalM2 : 0;
                const meanInformaticsM2 = countInformaticsM2 > 0 ? sumInformaticsM2 / countInformaticsM2 : 0;
                const meanFineM2 = countFineM2 > 0 ? sumFineM2 / countFineM2 : 0;
                const meanMusicM2 = countMusicM2 > 0 ? sumMusicM2 / countMusicM2 : 0;
                const meanAthleticM2 = countAthleticM2 > 0 ? sumAthleticM2 / countAthleticM2 : 0;
                const meanRateM2 = countRateM2 > 0 ? sumRateM2 / countRateM2 : 0;

                // Calculate mean M3
                const meanArabicM3 = countArabicM3 > 0 ? sumArabicM3 / countArabicM3 : 0;
                const meanAmazighM3 = countAmazighM3 > 0 ? sumAmazighM3 / countAmazighM3 : 0;
                const meanFrenchM3 = countFrenchM3 > 0 ? sumFrenchM3 / countFrenchM3 : 0;
                const meanEnglishM3 = countEnglishM3 > 0 ? sumEnglishM3 / countEnglishM3 : 0;
                const meanIslamicM3 = countIslamicM3 > 0 ? sumIslamicM3 / countIslamicM3 : 0;
                const meanCivicsM3 = countCivicsM3 > 0 ? sumCivicsM3 / countCivicsM3 : 0;
                const meanHistoryGeographyM3 = countHistoryGeographyM3 > 0 ? sumHistoryGeographyM3 / countHistoryGeographyM3 : 0;
                const meanMathM3 = countMathM3 > 0 ? sumMathM3 / countMathM3 : 0;
                const meanNatureM3 = countNatureM3 > 0 ? sumNatureM3 / countNatureM3 : 0;
                const meanPhysicalM3 = countPhysicalM3 > 0 ? sumPhysicalM3 / countPhysicalM3 : 0;
                const meanInformaticsM3 = countInformaticsM3 > 0 ? sumInformaticsM3 / countInformaticsM3 : 0;
                const meanFineM3 = countFineM3 > 0 ? sumFineM3 / countFineM3 : 0;
                const meanMusicM3 = countMusicM3 > 0 ? sumMusicM3 / countMusicM3 : 0;
                const meanAthleticM3 = countAthleticM3 > 0 ? sumAthleticM3 / countAthleticM3 : 0;
                const meanRateM3 = countRateM3 > 0 ? sumRateM3 / countRateM3 : 0;

                // Calculate mean M4
                const meanArabicM4 = countArabicM4 > 0 ? sumArabicM4 / countArabicM4 : 0;
                const meanAmazighM4 = countAmazighM4 > 0 ? sumAmazighM4 / countAmazighM4 : 0;
                const meanFrenchM4 = countFrenchM4 > 0 ? sumFrenchM4 / countFrenchM4 : 0;
                const meanEnglishM4 = countEnglishM4 > 0 ? sumEnglishM4 / countEnglishM4 : 0;
                const meanIslamicM4 = countIslamicM4 > 0 ? sumIslamicM4 / countIslamicM4 : 0;
                const meanCivicsM4 = countCivicsM4 > 0 ? sumCivicsM4 / countCivicsM4 : 0;
                const meanHistoryGeographyM4 = countHistoryGeographyM4 > 0 ? sumHistoryGeographyM4 / countHistoryGeographyM4 : 0;
                const meanMathM4 = countMathM4 > 0 ? sumMathM4 / countMathM4 : 0;
                const meanNatureM4 = countNatureM4 > 0 ? sumNatureM4 / countNatureM4 : 0;
                const meanPhysicalM4 = countPhysicalM4 > 0 ? sumPhysicalM4 / countPhysicalM4 : 0;
                const meanInformaticsM4 = countInformaticsM4 > 0 ? sumInformaticsM4 / countInformaticsM4 : 0;
                const meanFineM4 = countFineM4 > 0 ? sumFineM4 / countFineM4 : 0;
                const meanMusicM4 = countMusicM4 > 0 ? sumMusicM4 / countMusicM4 : 0;
                const meanAthleticM4 = countAthleticM4 > 0 ? sumAthleticM4 / countAthleticM4 : 0;
                const meanRateM4 = countRateM4 > 0 ? sumRateM4 / countRateM4 : 0;

                // Calculate mean M5
                const meanArabicM5 = countArabicM5 > 0 ? sumArabicM5 / countArabicM5 : 0;
                const meanAmazighM5 = countAmazighM5 > 0 ? sumAmazighM5 / countAmazighM5 : 0;
                const meanFrenchM5 = countFrenchM5 > 0 ? sumFrenchM5 / countFrenchM5 : 0;
                const meanEnglishM5 = countEnglishM5 > 0 ? sumEnglishM5 / countEnglishM5 : 0;
                const meanIslamicM5 = countIslamicM5 > 0 ? sumIslamicM5 / countIslamicM5 : 0;
                const meanCivicsM5 = countCivicsM5 > 0 ? sumCivicsM5 / countCivicsM5 : 0;
                const meanHistoryGeographyM5 = countHistoryGeographyM5 > 0 ? sumHistoryGeographyM5 / countHistoryGeographyM5 : 0;
                const meanMathM5 = countMathM5 > 0 ? sumMathM5 / countMathM5 : 0;
                const meanNatureM5 = countNatureM5 > 0 ? sumNatureM5 / countNatureM5 : 0;
                const meanPhysicalM5 = countPhysicalM5 > 0 ? sumPhysicalM5 / countPhysicalM5 : 0;
                const meanInformaticsM5 = countInformaticsM5 > 0 ? sumInformaticsM5 / countInformaticsM5 : 0;
                const meanFineM5 = countFineM5 > 0 ? sumFineM5 / countFineM5 : 0;
                const meanMusicM5 = countMusicM5 > 0 ? sumMusicM5 / countMusicM5 : 0;
                const meanAthleticM5 = countAthleticM5 > 0 ? sumAthleticM5 / countAthleticM5 : 0;
                const meanRateM5 = countRateM5 > 0 ? sumRateM5 / countRateM5 : 0;

                // Calculate mean M6
                const meanArabicM6 = countArabicM6 > 0 ? sumArabicM6 / countArabicM6 : 0;
                const meanAmazighM6 = countAmazighM6 > 0 ? sumAmazighM6 / countAmazighM6 : 0;
                const meanFrenchM6 = countFrenchM6 > 0 ? sumFrenchM6 / countFrenchM6 : 0;
                const meanEnglishM6 = countEnglishM6 > 0 ? sumEnglishM6 / countEnglishM6 : 0;
                const meanIslamicM6 = countIslamicM6 > 0 ? sumIslamicM6 / countIslamicM6 : 0;
                const meanCivicsM6 = countCivicsM6 > 0 ? sumCivicsM6 / countCivicsM6 : 0;
                const meanHistoryGeographyM6 = countHistoryGeographyM6 > 0 ? sumHistoryGeographyM6 / countHistoryGeographyM6 : 0;
                const meanMathM6 = countMathM6 > 0 ? sumMathM6 / countMathM6 : 0;
                const meanNatureM6 = countNatureM6 > 0 ? sumNatureM6 / countNatureM6 : 0;
                const meanPhysicalM6 = countPhysicalM6 > 0 ? sumPhysicalM6 / countPhysicalM6 : 0;
                const meanInformaticsM6 = countInformaticsM6 > 0 ? sumInformaticsM6 / countInformaticsM6 : 0;
                const meanFineM6 = countFineM6 > 0 ? sumFineM6 / countFineM6 : 0;
                const meanMusicM6 = countMusicM6 > 0 ? sumMusicM6 / countMusicM6 : 0;
                const meanAthleticM6 = countAthleticM6 > 0 ? sumAthleticM6 / countAthleticM6 : 0;
                const meanRateM6 = countRateM6 > 0 ? sumRateM6 / countRateM6 : 0;

                // Calculate mean M7
                const meanArabicM7 = countArabicM7 > 0 ? sumArabicM7 / countArabicM7 : 0;
                const meanAmazighM7 = countAmazighM7 > 0 ? sumAmazighM7 / countAmazighM7 : 0;
                const meanFrenchM7 = countFrenchM7 > 0 ? sumFrenchM7 / countFrenchM7 : 0;
                const meanEnglishM7 = countEnglishM7 > 0 ? sumEnglishM7 / countEnglishM7 : 0;
                const meanIslamicM7 = countIslamicM7 > 0 ? sumIslamicM7 / countIslamicM7 : 0;
                const meanCivicsM7 = countCivicsM7 > 0 ? sumCivicsM7 / countCivicsM7 : 0;
                const meanHistoryGeographyM7 = countHistoryGeographyM7 > 0 ? sumHistoryGeographyM7 / countHistoryGeographyM7 : 0;
                const meanMathM7 = countMathM7 > 0 ? sumMathM7 / countMathM7 : 0;
                const meanNatureM7 = countNatureM7 > 0 ? sumNatureM7 / countNatureM7 : 0;
                const meanPhysicalM7 = countPhysicalM7 > 0 ? sumPhysicalM7 / countPhysicalM7 : 0;
                const meanInformaticsM7 = countInformaticsM7 > 0 ? sumInformaticsM7 / countInformaticsM7 : 0;
                const meanFineM7 = countFineM7 > 0 ? sumFineM7 / countFineM7 : 0;
                const meanMusicM7 = countMusicM7 > 0 ? sumMusicM7 / countMusicM7 : 0;
                const meanAthleticM7 = countAthleticM7 > 0 ? sumAthleticM7 / countAthleticM7 : 0;
                const meanRateM7 = countRateM7 > 0 ? sumRateM7 / countRateM7 : 0;

                // Calculate mean M8
                const meanArabicM8 = countArabicM8 > 0 ? sumArabicM8 / countArabicM8 : 0;
                const meanAmazighM8 = countAmazighM8 > 0 ? sumAmazighM8 / countAmazighM8 : 0;
                const meanFrenchM8 = countFrenchM8 > 0 ? sumFrenchM8 / countFrenchM8 : 0;
                const meanEnglishM8 = countEnglishM8 > 0 ? sumEnglishM8 / countEnglishM8 : 0;
                const meanIslamicM8 = countIslamicM8 > 0 ? sumIslamicM8 / countIslamicM8 : 0;
                const meanCivicsM8 = countCivicsM8 > 0 ? sumCivicsM8 / countCivicsM8 : 0;
                const meanHistoryGeographyM8 = countHistoryGeographyM8 > 0 ? sumHistoryGeographyM8 / countHistoryGeographyM8 : 0;
                const meanMathM8 = countMathM8 > 0 ? sumMathM8 / countMathM8 : 0;
                const meanNatureM8 = countNatureM8 > 0 ? sumNatureM8 / countNatureM8 : 0;
                const meanPhysicalM8 = countPhysicalM8 > 0 ? sumPhysicalM8 / countPhysicalM8 : 0;
                const meanInformaticsM8 = countInformaticsM8 > 0 ? sumInformaticsM8 / countInformaticsM8 : 0;
                const meanFineM8 = countFineM8 > 0 ? sumFineM8 / countFineM8 : 0;
                const meanMusicM8 = countMusicM8 > 0 ? sumMusicM8 / countMusicM8 : 0;
                const meanAthleticM8 = countAthleticM8 > 0 ? sumAthleticM8 / countAthleticM8 : 0;
                const meanRateM8 = countRateM8 > 0 ? sumRateM8 / countRateM8 : 0;

                // Calculate mean M9
                const meanArabicM9 = countArabicM9 > 0 ? sumArabicM9 / countArabicM9 : 0;
                const meanAmazighM9 = countAmazighM9 > 0 ? sumAmazighM9 / countAmazighM9 : 0;
                const meanFrenchM9 = countFrenchM9 > 0 ? sumFrenchM9 / countFrenchM9 : 0;
                const meanEnglishM9 = countEnglishM9 > 0 ? sumEnglishM9 / countEnglishM9 : 0;
                const meanIslamicM9 = countIslamicM9 > 0 ? sumIslamicM9 / countIslamicM9 : 0;
                const meanCivicsM9 = countCivicsM9 > 0 ? sumCivicsM9 / countCivicsM9 : 0;
                const meanHistoryGeographyM9 = countHistoryGeographyM9 > 0 ? sumHistoryGeographyM9 / countHistoryGeographyM9 : 0;
                const meanMathM9 = countMathM9 > 0 ? sumMathM9 / countMathM9 : 0;
                const meanNatureM9 = countNatureM9 > 0 ? sumNatureM9 / countNatureM9 : 0;
                const meanPhysicalM9 = countPhysicalM9 > 0 ? sumPhysicalM9 / countPhysicalM9 : 0;
                const meanInformaticsM9 = countInformaticsM9 > 0 ? sumInformaticsM9 / countInformaticsM9 : 0;
                const meanFineM9 = countFineM9 > 0 ? sumFineM9 / countFineM9 : 0;
                const meanMusicM9 = countMusicM9 > 0 ? sumMusicM9 / countMusicM9 : 0;
                const meanAthleticM9 = countAthleticM9 > 0 ? sumAthleticM9 / countAthleticM9 : 0;
                const meanRateM9 = countRateM9 > 0 ? sumRateM9 / countRateM9 : 0;

                // Calculate mean M10
                const meanArabicM10 = countArabicM10 > 0 ? sumArabicM10 / countArabicM10 : 0;
                const meanAmazighM10 = countAmazighM10 > 0 ? sumAmazighM10 / countAmazighM10 : 0;
                const meanFrenchM10 = countFrenchM10 > 0 ? sumFrenchM10 / countFrenchM10 : 0;
                const meanEnglishM10 = countEnglishM10 > 0 ? sumEnglishM10 / countEnglishM10 : 0;
                const meanIslamicM10 = countIslamicM10 > 0 ? sumIslamicM10 / countIslamicM10 : 0;
                const meanCivicsM10 = countCivicsM10 > 0 ? sumCivicsM10 / countCivicsM10 : 0;
                const meanHistoryGeographyM10 = countHistoryGeographyM10 > 0 ? sumHistoryGeographyM10 / countHistoryGeographyM10 : 0;
                const meanMathM10 = countMathM10 > 0 ? sumMathM10 / countMathM10 : 0;
                const meanNatureM10 = countNatureM10 > 0 ? sumNatureM10 / countNatureM10 : 0;
                const meanPhysicalM10 = countPhysicalM10 > 0 ? sumPhysicalM10 / countPhysicalM10 : 0;
                const meanInformaticsM10 = countInformaticsM10 > 0 ? sumInformaticsM10 / countInformaticsM10 : 0;
                const meanFineM10 = countFineM10 > 0 ? sumFineM10 / countFineM10 : 0;
                const meanMusicM10 = countMusicM10 > 0 ? sumMusicM10 / countMusicM10 : 0;
                const meanAthleticM10 = countAthleticM10 > 0 ? sumAthleticM10 / countAthleticM10 : 0;
                const meanRateM10 = countRateM10 > 0 ? sumRateM10 / countRateM10 : 0;


                if (countArabicM2 >= 1) {
                 // Update the HTML elements with the means for M1 subject
                $('#arabic-meanM1').text(meanArabicM1.toFixed(2));
                $('#amazigh-meanM1').text(meanAmazighM1.toFixed(2));
                $('#french-meanM1').text(meanFrenchM1.toFixed(2));
                $('#english-meanM1').text(meanEnglishM1.toFixed(2));
                $('#islamic-meanM1').text(meanIslamicM1.toFixed(2));
                $('#civics-meanM1').text(meanCivicsM1.toFixed(2));
                $('#historyandgeography-meanM1').text(meanHistoryGeographyM1.toFixed(2));
                $('#math-meanM1').text(meanMathM1.toFixed(2));
                $('#nature-meanM1').text(meanNatureM1.toFixed(2));
                $('#physical-meanM1').text(meanPhysicalM1.toFixed(2));
                $('#informatics-meanM1').text(meanInformaticsM1.toFixed(2));
                $('#fine-meanM1').text(meanFineM1.toFixed(2));
                $('#music-meanM1').text(meanMusicM1.toFixed(2));
                $('#athletic-meanM1').text(meanAthleticM1.toFixed(2));
                $('#rate-meanM1, #M1-rate').text(meanRateM1.toFixed(2));

                // Update the HTML elements with the means for M2 subject
                $('#arabic-meanM2').text(meanArabicM2.toFixed(2));
                $('#amazigh-meanM2').text(meanAmazighM2.toFixed(2));
                $('#french-meanM2').text(meanFrenchM2.toFixed(2));
                $('#english-meanM2').text(meanEnglishM2.toFixed(2));
                $('#islamic-meanM2').text(meanIslamicM2.toFixed(2));
                $('#civics-meanM2').text(meanCivicsM2.toFixed(2));
                $('#historyandgeography-meanM2').text(meanHistoryGeographyM2.toFixed(2));
                $('#math-meanM2').text(meanMathM2.toFixed(2));
                $('#nature-meanM2').text(meanNatureM2.toFixed(2));
                $('#physical-meanM2').text(meanPhysicalM2.toFixed(2));
                $('#informatics-meanM2').text(meanInformaticsM2.toFixed(2));
                $('#fine-meanM2').text(meanFineM2.toFixed(2));
                $('#music-meanM2').text(meanMusicM2.toFixed(2));
                $('#athletic-meanM2').text(meanAthleticM2.toFixed(2));
                $('#rate-meanM2, #M2-rate').text(meanRateM2.toFixed(2));

                // Update the HTML elements with the means for M3 subject
                $('#arabic-meanM3').text(meanArabicM3.toFixed(2));
                $('#amazigh-meanM3').text(meanAmazighM3.toFixed(2));
                $('#french-meanM3').text(meanFrenchM3.toFixed(2));
                $('#english-meanM3').text(meanEnglishM3.toFixed(2));
                $('#islamic-meanM3').text(meanIslamicM3.toFixed(2));
                $('#civics-meanM3').text(meanCivicsM3.toFixed(2));
                $('#historyandgeography-meanM3').text(meanHistoryGeographyM3.toFixed(2));
                $('#math-meanM3').text(meanMathM3.toFixed(2));
                $('#nature-meanM3').text(meanNatureM3.toFixed(2));
                $('#physical-meanM3').text(meanPhysicalM3.toFixed(2));
                $('#informatics-meanM3').text(meanInformaticsM3.toFixed(2));
                $('#fine-meanM3').text(meanFineM3.toFixed(2));
                $('#music-meanM3').text(meanMusicM3.toFixed(2));
                $('#athletic-meanM3').text(meanAthleticM3.toFixed(2));
                $('#rate-meanM3, #M3-rate').text(meanRateM3.toFixed(2));

                // Update the HTML elements with the means for M4 subject
                $('#arabic-meanM4').text(meanArabicM4.toFixed(2));
                $('#amazigh-meanM4').text(meanAmazighM4.toFixed(2));
                $('#french-meanM4').text(meanFrenchM4.toFixed(2));
                $('#english-meanM4').text(meanEnglishM4.toFixed(2));
                $('#islamic-meanM4').text(meanIslamicM4.toFixed(2));
                $('#civics-meanM4').text(meanCivicsM4.toFixed(2));
                $('#historyandgeography-meanM4').text(meanHistoryGeographyM4.toFixed(2));
                $('#math-meanM4').text(meanMathM4.toFixed(2));
                $('#nature-meanM4').text(meanNatureM4.toFixed(2));
                $('#physical-meanM4').text(meanPhysicalM4.toFixed(2));
                $('#informatics-meanM4').text(meanInformaticsM4.toFixed(2));
                $('#fine-meanM4').text(meanFineM4.toFixed(2));
                $('#music-meanM4').text(meanMusicM4.toFixed(2));
                $('#athletic-meanM4').text(meanAthleticM4.toFixed(2));
                $('#rate-meanM4, #M4-rate').text(meanRateM4.toFixed(2));

                // Update the HTML elements with the means for M5 subject
                $('#arabic-meanM5').text(meanArabicM5.toFixed(2));
                $('#amazigh-meanM5').text(meanAmazighM5.toFixed(2));
                $('#french-meanM5').text(meanFrenchM5.toFixed(2));
                $('#english-meanM5').text(meanEnglishM5.toFixed(2));
                $('#islamic-meanM5').text(meanIslamicM5.toFixed(2));
                $('#civics-meanM5').text(meanCivicsM5.toFixed(2));
                $('#historyandgeography-meanM5').text(meanHistoryGeographyM5.toFixed(2));
                $('#math-meanM5').text(meanMathM5.toFixed(2));
                $('#nature-meanM5').text(meanNatureM5.toFixed(2));
                $('#physical-meanM5').text(meanPhysicalM5.toFixed(2));
                $('#informatics-meanM5').text(meanInformaticsM5.toFixed(2));
                $('#fine-meanM5').text(meanFineM5.toFixed(2));
                $('#music-meanM5').text(meanMusicM5.toFixed(2));
                $('#athletic-meanM5').text(meanAthleticM5.toFixed(2));
                $('#rate-meanM5, #M5-rate').text(meanRateM5.toFixed(2));

                // Update the HTML elements with the means for M6 subject
                $('#arabic-meanM6').text(meanArabicM6.toFixed(2));
                $('#amazigh-meanM6').text(meanAmazighM6.toFixed(2));
                $('#french-meanM6').text(meanFrenchM6.toFixed(2));
                $('#english-meanM6').text(meanEnglishM6.toFixed(2));
                $('#islamic-meanM6').text(meanIslamicM6.toFixed(2));
                $('#civics-meanM6').text(meanCivicsM6.toFixed(2));
                $('#historyandgeography-meanM6').text(meanHistoryGeographyM6.toFixed(2));
                $('#math-meanM6').text(meanMathM6.toFixed(2));
                $('#nature-meanM6').text(meanNatureM6.toFixed(2));
                $('#physical-meanM6').text(meanPhysicalM6.toFixed(2));
                $('#informatics-meanM6').text(meanInformaticsM6.toFixed(2));
                $('#fine-meanM6').text(meanFineM6.toFixed(2));
                $('#music-meanM6').text(meanMusicM6.toFixed(2));
                $('#athletic-meanM6').text(meanAthleticM6.toFixed(2));
                $('#rate-meanM6, #M6-rate').text(meanRateM6.toFixed(2));

                // Update the HTML elements with the means for M7 subject
                $('#arabic-meanM7').text(meanArabicM7.toFixed(2));
                $('#amazigh-meanM7').text(meanAmazighM7.toFixed(2));
                $('#french-meanM7').text(meanFrenchM7.toFixed(2));
                $('#english-meanM7').text(meanEnglishM7.toFixed(2));
                $('#islamic-meanM7').text(meanIslamicM7.toFixed(2));
                $('#civics-meanM7').text(meanCivicsM7.toFixed(2));
                $('#historyandgeography-meanM7').text(meanHistoryGeographyM7.toFixed(2));
                $('#math-meanM7').text(meanMathM7.toFixed(2));
                $('#nature-meanM7').text(meanNatureM7.toFixed(2));
                $('#physical-meanM7').text(meanPhysicalM7.toFixed(2));
                $('#informatics-meanM7').text(meanInformaticsM7.toFixed(2));
                $('#fine-meanM7').text(meanFineM7.toFixed(2));
                $('#music-meanM7').text(meanMusicM7.toFixed(2));
                $('#athletic-meanM7').text(meanAthleticM7.toFixed(2));
                $('#rate-meanM7, #M7-rate').text(meanRateM7.toFixed(2));

                // Update the HTML elements with the means for M8 subject
                $('#arabic-meanM8').text(meanArabicM8.toFixed(2));
                $('#amazigh-meanM8').text(meanAmazighM8.toFixed(2));
                $('#french-meanM8').text(meanFrenchM8.toFixed(2));
                $('#english-meanM8').text(meanEnglishM8.toFixed(2));
                $('#islamic-meanM8').text(meanIslamicM8.toFixed(2));
                $('#civics-meanM8').text(meanCivicsM8.toFixed(2));
                $('#historyandgeography-meanM8').text(meanHistoryGeographyM8.toFixed(2));
                $('#math-meanM8').text(meanMathM8.toFixed(2));
                $('#nature-meanM8').text(meanNatureM8.toFixed(2));
                $('#physical-meanM8').text(meanPhysicalM8.toFixed(2));
                $('#informatics-meanM8').text(meanInformaticsM8.toFixed(2));
                $('#fine-meanM8').text(meanFineM8.toFixed(2));
                $('#music-meanM8').text(meanMusicM8.toFixed(2));
                $('#athletic-meanM8').text(meanAthleticM8.toFixed(2));
                $('#rate-meanM8, #M8-rate').text(meanRateM8.toFixed(2));

                // Update the HTML elements with the means for M9 subject
                $('#arabic-meanM9').text(meanArabicM9.toFixed(2));
                $('#amazigh-meanM9').text(meanAmazighM9.toFixed(2));
                $('#french-meanM9').text(meanFrenchM9.toFixed(2));
                $('#english-meanM9').text(meanEnglishM9.toFixed(2));
                $('#islamic-meanM9').text(meanIslamicM9.toFixed(2));
                $('#civics-meanM9').text(meanCivicsM9.toFixed(2));
                $('#historyandgeography-meanM9').text(meanHistoryGeographyM9.toFixed(2));
                $('#math-meanM9').text(meanMathM9.toFixed(2));
                $('#nature-meanM9').text(meanNatureM9.toFixed(2));
                $('#physical-meanM9').text(meanPhysicalM9.toFixed(2));
                $('#informatics-meanM9').text(meanInformaticsM9.toFixed(2));
                $('#fine-meanM9').text(meanFineM9.toFixed(2));
                $('#music-meanM9').text(meanMusicM9.toFixed(2));
                $('#athletic-meanM9').text(meanAthleticM9.toFixed(2));
                $('#rate-meanM9, #M9-rate').text(meanRateM9.toFixed(2));

                // Update the HTML elements with the means for M10 subject
                $('#arabic-meanM10').text(meanArabicM10.toFixed(2));
                $('#amazigh-meanM10').text(meanAmazighM10.toFixed(2));
                $('#french-meanM10').text(meanFrenchM10.toFixed(2));
                $('#english-meanM10').text(meanEnglishM10.toFixed(2));
                $('#islamic-meanM10').text(meanIslamicM10.toFixed(2));
                $('#civics-meanM10').text(meanCivicsM10.toFixed(2));
                $('#historyandgeography-meanM10').text(meanHistoryGeographyM10.toFixed(2));
                $('#math-meanM10').text(meanMathM10.toFixed(2));
                $('#nature-meanM10').text(meanNatureM10.toFixed(2));
                $('#physical-meanM10').text(meanPhysicalM10.toFixed(2));
                $('#informatics-meanM10').text(meanInformaticsM10.toFixed(2));
                $('#fine-meanM10').text(meanFineM10.toFixed(2));
                $('#music-meanM10').text(meanMusicM10.toFixed(2));
                $('#athletic-meanM10').text(meanAthleticM10.toFixed(2));
                $('#rate-meanM10, #M10-rate').text(meanRateM10.toFixed(2));

                //add Badge Academic Achievement Arabic
                const meanValuesArabic = [
                    meanArabicM1, meanArabicM2, meanArabicM3, meanArabicM4,
                    meanArabicM5, meanArabicM6, meanArabicM7, meanArabicM8,
                    meanArabicM9, meanArabicM10
                ];

                // Determine the maximum mean value among the 10 means
                const maxMeanArabic = Math.max(...meanValuesArabic);

                if (maxMeanArabic !== 0.00) {
                // Find the index of the maximum mean value
                const maxMeanIndexArabic = meanValuesArabic.indexOf(maxMeanArabic);

                // Construct the selector for the element corresponding to the greatest mean value
                const selectorArabic = `#arabic-meanM${maxMeanIndexArabic + 1}`;

                // Call the function to add the badge dynamically
                addBadgeAcademicAchievementArabic(selectorArabic);
                }

                function addBadgeAcademicAchievementArabic(selectorArabic) {
                    // Add the badge dynamically to the element with the greatest mean value
                    $(selectorArabic).append('<span class="badge" title="أفضل قسم في المادة">الأول</span>');
                }

                //add Badge Academic Achievement Amazigh
                const meanValuesAmazigh = [
                    meanAmazighM1, meanAmazighM2, meanAmazighM3, meanAmazighM4,
                    meanAmazighM5, meanAmazighM6, meanAmazighM7, meanAmazighM8,
                    meanAmazighM9, meanAmazighM10
                ];

                // Determine the maximum mean value among the 10 means
                const maxMeanAmazigh = Math.max(...meanValuesAmazigh);

                if (maxMeanAmazigh !== 0.00) {
                // Find the index of the maximum mean value
                const maxMeanIndexAmazigh = meanValuesAmazigh.indexOf(maxMeanAmazigh);

                // Construct the selector for the element corresponding to the greatest mean value
                const selectorAmazigh = `#amazigh-meanM${maxMeanIndexAmazigh + 1}`;

                // Call the function to add the badge dynamically
                addBadgeAcademicAchievementAmazigh(selectorAmazigh);
                }

                function addBadgeAcademicAchievementAmazigh(selectorAmazigh) {
                    // Add the badge dynamically to the element with the greatest mean value
                    $(selectorAmazigh).append('<span class="badge" title="أفضل قسم في المادة">الأول</span>');
                }

                //add Badge Academic Achievement French
                const meanValuesFrench = [
                    meanFrenchM1, meanFrenchM2, meanFrenchM3, meanFrenchM4,
                    meanFrenchM5, meanFrenchM6, meanFrenchM7, meanFrenchM8,
                    meanFrenchM9, meanFrenchM10
                ];

                // Determine the maximum mean value among the 10 means
                const maxMeanFrench = Math.max(...meanValuesFrench);

                if (maxMeanFrench !== 0.00) {

                // Find the index of the maximum mean value
                const maxMeanIndexFrench = meanValuesFrench.indexOf(maxMeanFrench);

                // Construct the selector for the element corresponding to the greatest mean value
                const selectorFrench = `#french-meanM${maxMeanIndexFrench + 1}`;

                // Call the function to add the badge dynamically
                addBadgeAcademicAchievementFrench(selectorFrench);
                }

                function addBadgeAcademicAchievementFrench(selectorFrench) {
                    // Add the badge dynamically to the element with the greatest mean value
                    $(selectorFrench).append('<span class="badge" title="أفضل قسم في المادة">الأول</span>');
                }

                //add Badge Academic Achievement English
                const meanValuesEnglish = [
                    meanEnglishM1, meanEnglishM2, meanEnglishM3, meanEnglishM4,
                    meanEnglishM5, meanEnglishM6, meanEnglishM7, meanEnglishM8,
                    meanEnglishM9, meanEnglishM10
                ];

                // Determine the maximum mean value among the 10 means
                const maxMeanEnglish = Math.max(...meanValuesEnglish);

                if (maxMeanEnglish !== 0.00) {

                // Find the index of the maximum mean value
                const maxMeanIndexEnglish = meanValuesEnglish.indexOf(maxMeanEnglish);

                // Construct the selector for the element corresponding to the greatest mean value
                const selectorEnglish = `#english-meanM${maxMeanIndexEnglish + 1}`;

                // Call the function to add the badge dynamically
                addBadgeAcademicAchievementEnglish(selectorEnglish);
                }

                function addBadgeAcademicAchievementEnglish(selectorEnglish) {
                    // Add the badge dynamically to the element with the greatest mean value
                    $(selectorEnglish).append('<span class="badge" title="أفضل قسم في المادة">الأول</span>');
                }

                //add Badge Academic Achievement Islamic
                const meanValuesIslamic = [
                    meanIslamicM1, meanIslamicM2, meanIslamicM3, meanIslamicM4,
                    meanIslamicM5, meanIslamicM6, meanIslamicM7, meanIslamicM8,
                    meanIslamicM9, meanIslamicM10
                ];

                // Determine the maximum mean value among the 10 means
                const maxMeanIslamic = Math.max(...meanValuesIslamic);

                if (maxMeanIslamic !== 0.00) {

                // Find the index of the maximum mean value
                const maxMeanIndexIslamic = meanValuesIslamic.indexOf(maxMeanIslamic);

                // Construct the selector for the element corresponding to the greatest mean value
                const selectorIslamic = `#islamic-meanM${maxMeanIndexIslamic + 1}`;

                // Call the function to add the badge dynamically
                addBadgeAcademicAchievementIslamic(selectorIslamic);
                }

                function addBadgeAcademicAchievementIslamic(selectorIslamic) {
                    // Add the badge dynamically to the element with the greatest mean value
                    $(selectorIslamic).append('<span class="badge" title="أفضل قسم في المادة">الأول</span>');
                }

                //add Badge Academic Achievement Civics
                const meanValuesCivics = [
                    meanCivicsM1, meanCivicsM2, meanCivicsM3, meanCivicsM4,
                    meanCivicsM5, meanCivicsM6, meanCivicsM7, meanCivicsM8,
                    meanCivicsM9, meanCivicsM10
                ];

                // Determine the maximum mean value among the 10 means
                const maxMeanCivics = Math.max(...meanValuesCivics);

                if (maxMeanCivics !== 0.00) {

                // Find the index of the maximum mean value
                const maxMeanIndexCivics = meanValuesCivics.indexOf(maxMeanCivics);

                // Construct the selector for the element corresponding to the greatest mean value
                const selectorCivics = `#civics-meanM${maxMeanIndexCivics + 1}`;

                // Call the function to add the badge dynamically
                addBadgeAcademicAchievementCivics(selectorCivics);
                }

                function addBadgeAcademicAchievementCivics(selectorCivics) {
                    // Add the badge dynamically to the element with the greatest mean value
                    $(selectorCivics).append('<span class="badge" title="أفضل قسم في المادة">الأول</span>');
                }

                //add Badge Academic Achievement HistoryGeography
                const meanValuesHistoryGeography = [
                    meanHistoryGeographyM1, meanHistoryGeographyM2, meanHistoryGeographyM3, meanHistoryGeographyM4,
                    meanHistoryGeographyM5, meanHistoryGeographyM6, meanHistoryGeographyM7, meanHistoryGeographyM8,
                    meanHistoryGeographyM9, meanHistoryGeographyM10
                ];

                // Determine the maximum mean value among the 10 means
                const maxMeanHistoryGeography = Math.max(...meanValuesHistoryGeography);

                if (maxMeanHistoryGeography !== 0.00) {

                // Find the index of the maximum mean value
                const maxMeanIndexHistoryGeography = meanValuesHistoryGeography.indexOf(maxMeanHistoryGeography);

                // Construct the selector for the element corresponding to the greatest mean value
                const selectorHistoryGeography = `#historygeography-meanM${maxMeanIndexHistoryGeography + 1}`;

                // Call the function to add the badge dynamically
                addBadgeAcademicAchievementHistoryGeography(selectorHistoryGeography);
                }

                function addBadgeAcademicAchievementHistoryGeography(selectorHistoryGeography) {
                    // Add the badge dynamically to the element with the greatest mean value
                    $(selectorHistoryGeography).append('<span class="badge" title="أفضل قسم في المادة">الأول</span>');
                }

                //add Badge Academic Achievement Math
                const meanValuesMath = [
                    meanMathM1, meanMathM2, meanMathM3, meanMathM4,
                    meanMathM5, meanMathM6, meanMathM7, meanMathM8,
                    meanMathM9, meanMathM10
                ];

                // Determine the maximum mean value among the 10 means
                const maxMeanMath = Math.max(...meanValuesMath);

                if (maxMeanMath !== 0.00) {

                // Find the index of the maximum mean value
                const maxMeanIndexMath = meanValuesMath.indexOf(maxMeanMath);

                // Construct the selector for the element corresponding to the greatest mean value
                const selectorMath = `#math-meanM${maxMeanIndexMath + 1}`;

                // Call the function to add the badge dynamically
                addBadgeAcademicAchievementMath(selectorMath);
                }

                function addBadgeAcademicAchievementMath(selectorMath) {
                    // Add the badge dynamically to the element with the greatest mean value
                    $(selectorMath).append('<span class="badge" title="أفضل قسم في المادة">الأول</span>');
                }

                //add Badge Academic Achievement Nature
                const meanValuesNature = [
                    meanNatureM1, meanNatureM2, meanNatureM3, meanNatureM4,
                    meanNatureM5, meanNatureM6, meanNatureM7, meanNatureM8,
                    meanNatureM9, meanNatureM10
                ];

                // Determine the maximum mean value among the 10 means
                const maxMeanNature = Math.max(...meanValuesNature);

                if (maxMeanNature !== 0.00) {

                // Find the index of the maximum mean value
                const maxMeanIndexNature = meanValuesNature.indexOf(maxMeanNature);

                // Construct the selector for the element corresponding to the greatest mean value
                const selectorNature = `#nature-meanM${maxMeanIndexNature + 1}`;

                // Call the function to add the badge dynamically
                addBadgeAcademicAchievementNature(selectorNature);
                }

                function addBadgeAcademicAchievementNature(selectorNature) {
                    // Add the badge dynamically to the element with the greatest mean value
                    $(selectorNature).append('<span class="badge" title="أفضل قسم في المادة">الأول</span>');
                }

                //add Badge Academic Achievement Physical
                const meanValuesPhysical = [
                    meanPhysicalM1, meanPhysicalM2, meanPhysicalM3, meanPhysicalM4,
                    meanPhysicalM5, meanPhysicalM6, meanPhysicalM7, meanPhysicalM8,
                    meanPhysicalM9, meanPhysicalM10
                ];

                // Determine the maximum mean value among the 10 means
                const maxMeanPhysical = Math.max(...meanValuesPhysical);

                if (maxMeanPhysical !== 0.00) {

                // Find the index of the maximum mean value
                const maxMeanIndexPhysical = meanValuesPhysical.indexOf(maxMeanPhysical);

                // Construct the selector for the element corresponding to the greatest mean value
                const selectorPhysical = `#physical-meanM${maxMeanIndexPhysical + 1}`;

                // Call the function to add the badge dynamically
                addBadgeAcademicAchievementPhysical(selectorPhysical);
                }

                function addBadgeAcademicAchievementPhysical(selectorPhysical) {
                    // Add the badge dynamically to the element with the greatest mean value
                    $(selectorPhysical).append('<span class="badge" title="أفضل قسم في المادة">الأول</span>');
                }

                //add Badge Academic Achievement Informatics
                const meanValuesInformatics = [
                    meanInformaticsM1, meanInformaticsM2, meanInformaticsM3, meanInformaticsM4,
                    meanInformaticsM5, meanInformaticsM6, meanInformaticsM7, meanInformaticsM8,
                    meanInformaticsM9, meanInformaticsM10
                ];

                // Determine the maximum mean value among the 10 means
                const maxMeanInformatics = Math.max(...meanValuesInformatics);

                if (maxMeanInformatics !== 0.00) {

                // Find the index of the maximum mean value
                const maxMeanIndexInformatics = meanValuesInformatics.indexOf(maxMeanInformatics);

                // Construct the selector for the element corresponding to the greatest mean value
                const selectorInformatics = `#informatics-meanM${maxMeanIndexInformatics + 1}`;

                // Call the function to add the badge dynamically
                addBadgeAcademicAchievementInformatics(selectorInformatics);
                }

                function addBadgeAcademicAchievementInformatics(selectorInformatics) {
                    // Add the badge dynamically to the element with the greatest mean value
                    $(selectorInformatics).append('<span class="badge" title="أفضل قسم في المادة">الأول</span>');
                }

                //add Badge Academic Achievement Fine
                const meanValuesFine = [
                    meanFineM1, meanFineM2, meanFineM3, meanFineM4,
                    meanFineM5, meanFineM6, meanFineM7, meanFineM8,
                    meanFineM9, meanFineM10
                ];

                // Determine the maximum mean value among the 10 means
                const maxMeanFine = Math.max(...meanValuesFine);

                if (maxMeanFine !== 0.00) {

                // Find the index of the maximum mean value
                const maxMeanIndexFine = meanValuesFine.indexOf(maxMeanFine);

                // Construct the selector for the element corresponding to the greatest mean value
                const selectorFine = `#fine-meanM${maxMeanIndexFine + 1}`;

                // Call the function to add the badge dynamically
                addBadgeAcademicAchievementFine(selectorFine);
                }

                function addBadgeAcademicAchievementFine(selectorFine) {
                    // Add the badge dynamically to the element with the greatest mean value
                    $(selectorFine).append('<span class="badge" title="أفضل قسم في المادة">الأول</span>');
                }

                //add Badge Academic Achievement Music
                const meanValuesMusic = [
                    meanMusicM1, meanMusicM2, meanMusicM3, meanMusicM4,
                    meanMusicM5, meanMusicM6, meanMusicM7, meanMusicM8,
                    meanMusicM9, meanMusicM10
                ];

                // Determine the maximum mean value among the 10 means
                const maxMeanMusic = Math.max(...meanValuesMusic);

                if (maxMeanMusic !== 0.00) {

                // Find the index of the maximum mean value
                const maxMeanIndexMusic = meanValuesMusic.indexOf(maxMeanMusic);

                // Construct the selector for the element corresponding to the greatest mean value
                const selectorMusic = `#music-meanM${maxMeanIndexMusic + 1}`;

                // Call the function to add the badge dynamically
                addBadgeAcademicAchievementMusic(selectorMusic);
                }

                function addBadgeAcademicAchievementMusic(selectorMusic) {
                    // Add the badge dynamically to the element with the greatest mean value
                    $(selectorMusic).append('<span class="badge" title="أفضل قسم في المادة">الأول</span>');
                }

                //add Badge Academic Achievement Athletic
                const meanValuesAthletic = [
                    meanAthleticM1, meanAthleticM2, meanAthleticM3, meanAthleticM4,
                    meanAthleticM5, meanAthleticM6, meanAthleticM7, meanAthleticM8,
                    meanAthleticM9, meanAthleticM10
                ];

                // Determine the maximum mean value among the 10 means
                const maxMeanAthletic = Math.max(...meanValuesAthletic);

                if (maxMeanAthletic !== 0.00) {

                // Find the index of the maximum mean value
                const maxMeanIndexAthletic = meanValuesAthletic.indexOf(maxMeanAthletic);

                // Construct the selector for the element corresponding to the greatest mean value
                const selectorAthletic = `#athletic-meanM${maxMeanIndexAthletic + 1}`;

                // Call the function to add the badge dynamically
                addBadgeAcademicAchievementAthletic(selectorAthletic);
                }

                function addBadgeAcademicAchievementAthletic(selectorAthletic) {
                    // Add the badge dynamically to the element with the greatest mean value
                    $(selectorAthletic).append('<span class="badge" title="أفضل قسم في المادة">الأول</span>');
                }

                //add Badge Academic Achievement Rate
                const meanValuesRate = [
                    meanRateM1, meanRateM2, meanRateM3, meanRateM4,
                    meanRateM5, meanRateM6, meanRateM7, meanRateM8,
                    meanRateM9, meanRateM10
                ];

                // Determine the maximum mean value among the 10 means
                const maxMeanRate = Math.max(...meanValuesRate);

                if (maxMeanRate !== 0.00) {

                // Find the index of the maximum mean value
                const maxMeanIndexRate = meanValuesRate.indexOf(maxMeanRate);

                // Construct the selector for the element corresponding to the greatest mean value
                const selectorRate = `#rate-meanM${maxMeanIndexRate + 1}`;

                // Call the function to add the badge dynamically
                addBadgeAcademicAchievementRate(selectorRate);
                }

                function addBadgeAcademicAchievementRate(selectorRate) {
                    // Add the badge dynamically to the element with the greatest mean value
                    $(selectorRate).append('<span class="badge" title="أفضل قسم في المادة">الأول</span>');
                }

                // Rank rate
                // Sort mean values in descending order
                // Filter out mean values equal to 0.00 and their corresponding indices
                const nonZeroMeanValues = meanValuesRate.filter(value => value !== 0);
                const nonZeroIndices = meanValuesRate.map((value, index) => value !== 0 ? index : null).filter(index => index !== null);

                // Sort non-zero mean values in descending order
                const sortedNonZeroMeanValues = nonZeroMeanValues.slice().sort((a, b) => b - a);

                // Assign ranks based on sorted order
                const rank = meanValuesRate.map(value => {
                    if (value === 0) return null; // Skip assigning rank for mean value equal to 0.00
                    return sortedNonZeroMeanValues.indexOf(value) + 1;
                });

                // Append results to <td> elements
                for (let i = 0; i < rank.length; i++) {
                    if (rank[i] !== null) { // Check if rank is not null
                        const rankId = `#M${nonZeroIndices[i] + 1}-rank`;
                        $(rankId).text(rank[i]);
                    }
                }

                // percentage rate
                // Multiply each mean value by 100 and divide by 20
                // Define a function to calculate the grade based on the mean value

                // Check if any value in meanValuesRate is greater than 0
                const isAnyNonZero = meanValuesRate.some(value => value > 0);

                // Calculate degreeValues only if there are non-zero values in meanValuesRate
                if (isAnyNonZero) {
                    const degreeValues = meanValuesRate.map(value => (value * 100) / 20);

                    // Iterate over degreeValues and append the results to <td> elements
                    for (let i = 0; i < degreeValues.length; i++) {
                        const rateId = `#M${i + 1}-degre`;
                        const value = degreeValues[i].toFixed(2); // Assuming you want 2 decimal places
                        $(rateId).text(value);

                        // Check if degree value is greater than 0 before calculating and appending the grade
                        if (degreeValues[i] > 0) {
                            let grade = "";
                            if (degreeValues[i] >= 90 && degreeValues[i] <= 100) {
                                grade = "ممتاز";
                            } else if (degreeValues[i] >= 80 && degreeValues[i] <= 89.99) {
                                grade = "جيد جدا";
                            } else if (degreeValues[i] >= 70 && degreeValues[i] <= 79.99) {
                                grade = "جيد";
                            } else if (degreeValues[i] >= 60 && degreeValues[i] <= 69.99) {
                                grade = "متوسط";
                            } else if (degreeValues[i] >= 50 && degreeValues[i] <= 59.99) {
                                grade = "ضعيف";
                            } else if (degreeValues[i] <= 49.99) {
                                grade = "ضعيف جدا";
                            }

                            // Append the grade to the corresponding <td> element
                            const avgId = `#M${i + 1}-avg`;
                            $(avgId).text(grade);
                        } else {
                            // If degree value is exactly 0.00, display blank in the corresponding <td> element
                            const avgId = `#M${i + 1}-avg`;
                            $(avgId).text("-");
                        }
                    }
                } else {
                    // If all values in meanValuesRate are 0, display blank in all <td> elements
                    for (let i = 0; i < meanValuesRate.length; i++) {
                        const rateId = `#M${i + 1}-degre`;
                        const avgId = `#M${i + 1}-avg`;
                        $(rateId).text("-");
                        $(avgId).text("-");
                    }
                }
                
            } else {
                $('.edu-Achievement-area').hide();
                $('.edu-Ranking-area').hide();
            }

                // diffrance between T1 and T2
                // Initialize variables to hold the sum of values for each subject

                let sumArabicT1 = 0;
                let sumAmazighT1 = 0;
                let sumFrenchT1 = 0;
                let sumEnglishT1 = 0;
                let sumIslamicT1 = 0;
                let sumCivicsT1 = 0;
                let sumHistoryAndGeographyT1 = 0;
                let sumMathT1 = 0;
                let sumNatureT1 = 0;
                let sumPhysicalT1 = 0;
                let sumInformaticsT1 = 0;
                let sumFineT1 = 0;
                let sumMusicT1 = 0;
                let sumAthleticT1 = 0;
                let sumRateT1 = 0;

                // Iterate over each row to sum up the values for each subject
                table.rows().every(function() {
                    const rowData = this.data();

                    // Count the total number of rows
                    let totalRows = table.rows().count();

                    sumArabicT1 += parseFloat(rowData['اللغة العربية ف 1']) || 0;
                    sumAmazighT1 += parseFloat(rowData['اللغة اﻷمازيغية ف 1']) || 0;
                    sumFrenchT1 += parseFloat(rowData['اللغة الفرنسية ف 1']) || 0;
                    sumEnglishT1 += parseFloat(rowData['اللغة الإنجليزية ف 1']) || 0;
                    sumIslamicT1 += parseFloat(rowData['التربية الإسلامية ف 1']) || 0;
                    sumCivicsT1 += parseFloat(rowData['التربية المدنية ف 1']) || 0;
                    sumHistoryAndGeographyT1 += parseFloat(rowData['التاريخ والجغرافيا ف 1']) || 0;
                    sumMathT1 += parseFloat(rowData['الرياضيات ف 1']) || 0;
                    sumNatureT1 += parseFloat(rowData['ع الطبيعة و الحياة ف 1']) || 0;
                    sumPhysicalT1 += parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 1']) || 0;
                    sumInformaticsT1 += parseFloat(rowData['المعلوماتية ف 1']) || 0;
                    sumFineT1 += parseFloat(rowData['التربية التشكيلية ف 1']) || 0;
                    sumMusicT1 += parseFloat(rowData['التربية الموسيقية ف 1']) || 0;
                    sumAthleticT1 += parseFloat(rowData['ت البدنية و الرياضية ف 1']) || 0;
                    sumRateT1 += parseFloat(rowData['معدل الفصل 1']) || 0;
                });

                // Calculate the mean (average) for each subject
                let meanArabicT1 = sumArabicT1 / totalRows;
                let meanAmazighT1 = sumAmazighT1 / totalRows;
                let meanFrenchT1 = sumFrenchT1 / totalRows;
                let meanEnglishT1 = sumEnglishT1 / totalRows;
                let meanIslamicT1 = sumIslamicT1 / totalRows;
                let meanCivicsT1 = sumCivicsT1 / totalRows;
                let meanHistoryAndGeographyT1 = sumHistoryAndGeographyT1 / totalRows;
                let meanMathT1 = sumMathT1 / totalRows;
                let meanNatureT1 = sumNatureT1 / totalRows;
                let meanPhysicalT1 = sumPhysicalT1 / totalRows;
                let meanInformaticsT1 = sumInformaticsT1 / totalRows;
                let meanFineT1 = sumFineT1 / totalRows;
                let meanMusicT1 = sumMusicT1 / totalRows;
                let meanAthleticT1 = sumAthleticT1 / totalRows;
                let meanRateT1 = sumRateT1 / totalRows;

                // Update the content of the <td> elements with the means
                $('#arabic-meanT1Diff').text(meanArabicT1.toFixed(2));
                $('#amazigh-meanT1Diff').text(meanAmazighT1.toFixed(2));
                $('#french-meanT1Diff').text(meanFrenchT1.toFixed(2));
                $('#english-meanT1Diff').text(meanEnglishT1.toFixed(2));
                $('#islamic-meanT1Diff').text(meanIslamicT1.toFixed(2));
                $('#civics-meanT1Diff').text(meanCivicsT1.toFixed(2));
                $('#historyandgeography-meanT1Diff').text(meanHistoryAndGeographyT1.toFixed(2));
                $('#math-meanT1Diff').text(meanMathT1.toFixed(2));
                $('#nature-meanT1Diff').text(meanNatureT1.toFixed(2));
                $('#physical-meanT1Diff').text(meanPhysicalT1.toFixed(2));
                $('#informatics-meanT1Diff').text(meanInformaticsT1.toFixed(2));
                $('#fine-meanT1Diff').text(meanFineT1.toFixed(2));
                $('#music-meanT1Diff').text(meanMusicT1.toFixed(2));
                $('#athletic-meanT1Diff').text(meanAthleticT1.toFixed(2));
                $('#rate-meanT1Diff').text(meanRateT1.toFixed(2));

                // Count the number of values greater than 1 in 'اللغة العربية' and 'اللغة اﻷمازيغية'
                let countarabicGreaterThanTenT1 = 0;
                let countamazighGreaterThanTenT1 = 0;
                let countfrenchGreaterThanTenT1 = 0;
                let countenglishGreaterThanTenT1 = 0;
                let countislamicGreaterThanTenT1 = 0;
                let countcivicsGreaterThanTenT1 = 0;
                let counthistoryandgeographyGreaterThanTenT1 = 0;
                let countmathGreaterThanTenT1 = 0;
                let countnatureGreaterThanTenT1 = 0;
                let countphysicalGreaterThanTenT1 = 0;
                let countinformaticsGreaterThanTenT1 = 0;
                let countfineGreaterThanTenT1 = 0;
                let countmusicGreaterThanTenT1 = 0;
                let countathleticGreaterThanTenT1 = 0;
                let countrateGreaterThanTenT1 = 0;

                table.rows().every(function() {
                    const rowData = this.data();

                    // Calculate the total number of rows
                    const totalRows = table.rows().count();

                    const arabicValue = parseFloat(rowData['اللغة العربية ف 1']) || 0;
                    const amazighValue = parseFloat(rowData['اللغة اﻷمازيغية ف 1']) || 0;
                    const frenchValue = parseFloat(rowData['اللغة الفرنسية ف 1']) || 0;
                    const englishValue = parseFloat(rowData['اللغة الإنجليزية ف 1']) || 0;
                    const islamicValue = parseFloat(rowData['التربية الإسلامية ف 1']) || 0;
                    const civicsValue = parseFloat(rowData['التربية المدنية ف 1']) || 0;
                    const historyandgeographyValue = parseFloat(rowData['التاريخ والجغرافيا ف 1']) || 0;
                    const mathValue = parseFloat(rowData['الرياضيات ف 1']) || 0;
                    const natureValue = parseFloat(rowData['ع الطبيعة و الحياة ف 1']) || 0;
                    const physicalValue = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 1']) || 0;
                    const informaticsValue = parseFloat(rowData['المعلوماتية ف 1']) || 0;
                    const fineValue = parseFloat(rowData['التربية التشكيلية ف 1']) || 0;
                    const musicValue = parseFloat(rowData['التربية الموسيقية ف 1']) || 0;
                    const athleticValue = parseFloat(rowData['ت البدنية و الرياضية ف 1']) || 0;
                    const rateValue = parseFloat(rowData['معدل الفصل 1']) || 0;

                    if (arabicValue >= 10) {
                        countarabicGreaterThanTenT1++;
                    }
                    if (amazighValue >= 10) {
                        countamazighGreaterThanTenT1++;
                    }
                    if (frenchValue >= 10) {
                        countfrenchGreaterThanTenT1++;
                    }
                    if (englishValue >= 10) {
                        countenglishGreaterThanTenT1++;
                    }
                    if (islamicValue >= 10) {
                        countislamicGreaterThanTenT1++;
                    }
                    if (civicsValue >= 10) {
                        countcivicsGreaterThanTenT1++;
                    }
                    if (historyandgeographyValue >= 10) {
                        counthistoryandgeographyGreaterThanTenT1++;
                    }
                    if (mathValue >= 10) {
                        countmathGreaterThanTenT1++;
                    }
                    if (natureValue >= 10) {
                        countnatureGreaterThanTenT1++;
                    }
                    if (physicalValue >= 10) {
                        countphysicalGreaterThanTenT1++;
                    }
                    if (informaticsValue >= 10) {
                        countinformaticsGreaterThanTenT1++;
                    }
                    if (fineValue >= 10) {
                        countfineGreaterThanTenT1++;
                    }
                    if (musicValue >= 10) {
                        countmusicGreaterThanTenT1++;
                    }
                    if (athleticValue >= 10) {
                        countathleticGreaterThanTenT1++;
                    }
                    if (rateValue >= 10) {
                        countrateGreaterThanTenT1++;
                    }        

                    return true;

                });

                    // Calculate the percentage of values greater than or equal to 10 for each subject
                    const percentageArabicGreaterThanTenT1 = (countarabicGreaterThanTenT1 / totalRows) * 100;
                    const percentageAmazighGreaterThanTenT1 = (countamazighGreaterThanTenT1 / totalRows) * 100;
                    const percentageFrenchGreaterThanTenT1 = (countfrenchGreaterThanTenT1 / totalRows) * 100;
                    const percentageEnglishGreaterThanTenT1 = (countenglishGreaterThanTenT1 / totalRows) * 100;
                    const percentageIslamicGreaterThanTenT1 = (countislamicGreaterThanTenT1 / totalRows) * 100;
                    const percentageCivicsGreaterThanTenT1 = (countcivicsGreaterThanTenT1 / totalRows) * 100;
                    const percentageHistoryAndGeographyGreaterThanTenT1 = (counthistoryandgeographyGreaterThanTenT1 / totalRows) * 100;
                    const percentageMathGreaterThanTenT1 = (countmathGreaterThanTenT1 / totalRows) * 100;
                    const percentageNatureGreaterThanTenT1 = (countnatureGreaterThanTenT1 / totalRows) * 100;
                    const percentagePhysicalGreaterThanTenT1 = (countphysicalGreaterThanTenT1 / totalRows) * 100;
                    const percentageInformaticsGreaterThanTenT1 = (countinformaticsGreaterThanTenT1 / totalRows) * 100;
                    const percentageFineGreaterThanTenT1 = (countfineGreaterThanTenT1 / totalRows) * 100;
                    const percentageMusicGreaterThanTenT1 = (countmusicGreaterThanTenT1 / totalRows) * 100;
                    const percentageAthleticGreaterThanTenT1 = (countathleticGreaterThanTenT1 / totalRows) * 100;
                    const percentageRateGreaterThanTenT1 = (countrateGreaterThanTenT1 / totalRows) * 100;

                    // Update the content of the HTML elements with the counts and percentages
                    $('#arabic-countGTenT1Diff').text(countarabicGreaterThanTenT1);
                    $('#amazigh-countGTenT1Diff').text(countamazighGreaterThanTenT1);
                    $('#french-countGTenT1Diff').text(countfrenchGreaterThanTenT1);
                    $('#english-countGTenT1Diff').text(countenglishGreaterThanTenT1);
                    $('#islamic-countGTenT1Diff').text(countislamicGreaterThanTenT1);
                    $('#civics-countGTenT1Diff').text(countcivicsGreaterThanTenT1);
                    $('#historyandgeography-countGTenT1Diff').text(counthistoryandgeographyGreaterThanTenT1);
                    $('#math-countGTenT1Diff').text(countmathGreaterThanTenT1);
                    $('#nature-countGTenT1Diff').text(countnatureGreaterThanTenT1);
                    $('#physical-countGTenT1Diff').text(countphysicalGreaterThanTenT1);
                    $('#informatics-countGTenT1Diff').text(countinformaticsGreaterThanTenT1);
                    $('#fine-countGTenT1Diff').text(countfineGreaterThanTenT1);
                    $('#music-countGTenT1Diff').text(countmusicGreaterThanTenT1);
                    $('#athletic-countGTenT1Diff').text(countathleticGreaterThanTenT1);
                    $('#rate-countGTenT1Diff').text(countrateGreaterThanTenT1);

                    // Update the content of the HTML elements with the counts and percentages
                    $('#arabic-percentageGTenT1Diff').text(percentageArabicGreaterThanTenT1.toFixed(2) + "%");
                    $('#amazigh-percentageGTenT1Diff').text(percentageAmazighGreaterThanTenT1.toFixed(2) + "%");
                    $('#french-percentageGTenT1Diff').text(percentageFrenchGreaterThanTenT1.toFixed(2) + "%");
                    $('#english-percentageGTenT1Diff').text(percentageEnglishGreaterThanTenT1.toFixed(2) + "%");
                    $('#islamic-percentageGTenT1Diff').text(percentageIslamicGreaterThanTenT1.toFixed(2) + "%");
                    $('#civics-percentageGTenT1Diff').text(percentageCivicsGreaterThanTenT1.toFixed(2) + "%");
                    $('#historyandgeography-percentageGTenT1Diff').text(percentageHistoryAndGeographyGreaterThanTenT1.toFixed(2) + "%");
                    $('#math-percentageGTenT1Diff').text(percentageMathGreaterThanTenT1.toFixed(2) + "%");
                    $('#nature-percentageGTenT1Diff').text(percentageNatureGreaterThanTenT1.toFixed(2) + "%");
                    $('#physical-percentageGTenT1Diff').text(percentagePhysicalGreaterThanTenT1.toFixed(2) + "%");
                    $('#informatics-percentageGTenT1Diff').text(percentageInformaticsGreaterThanTenT1.toFixed(2) + "%");
                    $('#fine-percentageGTenT1Diff').text(percentageFineGreaterThanTenT1.toFixed(2) + "%");
                    $('#music-percentageGTenT1Diff').text(percentageMusicGreaterThanTenT1.toFixed(2) + "%");
                    $('#athletic-percentageGTenT1Diff').text(percentageAthleticGreaterThanTenT1.toFixed(2) + "%");
                    $('#rate-percentageGTenT1Diff').text(percentageRateGreaterThanTenT1.toFixed(2) + "%");

                    //Average spreads
                    const percentageArabicT1T2 = Math.abs(percentageArabicGreaterThanTen - percentageArabicGreaterThanTenT1);
                    const percentageAmazighT1T2 = Math.abs(percentageAmazighGreaterThanTen - percentageAmazighGreaterThanTenT1);
                    const percentageFrenchT1T2 = Math.abs(percentageFrenchGreaterThanTen - percentageFrenchGreaterThanTenT1);
                    const percentageEnglishT1T2 = Math.abs(percentageEnglishGreaterThanTen - percentageEnglishGreaterThanTenT1);
                    const percentageIslamicT1T2 = Math.abs(percentageIslamicGreaterThanTen - percentageIslamicGreaterThanTenT1);
                    const percentageCivicsT1T2 = Math.abs(percentageCivicsGreaterThanTen - percentageCivicsGreaterThanTenT1);
                    const percentageHistoryAndGeographyT1T2 = Math.abs(percentageHistoryAndGeographyGreaterThanTen - percentageHistoryAndGeographyGreaterThanTenT1);
                    const percentageMathT1T2 = Math.abs(percentageMathGreaterThanTen - percentageMathGreaterThanTenT1);
                    const percentageNatureT1T2 = Math.abs(percentageNatureGreaterThanTen - percentageNatureGreaterThanTenT1);
                    const percentagePhysicalT1T2 = Math.abs(percentagePhysicalGreaterThanTen - percentagePhysicalGreaterThanTenT1);
                    const percentageInformaticsT1T2 = Math.abs(percentageInformaticsGreaterThanTen - percentageInformaticsGreaterThanTenT1);
                    const percentageFineT1T2 = Math.abs(percentageFineGreaterThanTen - percentageFineGreaterThanTenT1);
                    const percentageMusicT1T2 = Math.abs(percentageMusicGreaterThanTen - percentageMusicGreaterThanTenT1);
                    const percentageAthleticT1T2 = Math.abs(percentageAthleticGreaterThanTen - percentageAthleticGreaterThanTenT1);
                    const percentageRateT1T2 = Math.abs(percentageRateGreaterThanTen - percentageRateGreaterThanTenT1); 

                    // Update the content of the HTML elements with the counts and percentages
                    $('#arabic-percentageGTenT1T2Diff').text(percentageArabicT1T2.toFixed(2) + "%");
                    $('#amazigh-percentageGTenT1T2Diff').text(percentageAmazighT1T2.toFixed(2) + "%");
                    $('#french-percentageGTenT1T2Diff').text(percentageFrenchT1T2.toFixed(2) + "%");
                    $('#english-percentageGTenT1T2Diff').text(percentageEnglishT1T2.toFixed(2) + "%");
                    $('#islamic-percentageGTenT1T2Diff').text(percentageIslamicT1T2.toFixed(2) + "%");
                    $('#civics-percentageGTenT1T2Diff').text(percentageCivicsT1T2.toFixed(2) + "%");
                    $('#historyandgeography-percentageGTenT1T2Diff').text(percentageHistoryAndGeographyT1T2.toFixed(2) + "%");
                    $('#math-percentageGTenT1T2Diff').text(percentageMathT1T2.toFixed(2) + "%");
                    $('#nature-percentageGTenT1T2Diff').text(percentageNatureT1T2.toFixed(2) + "%");
                    $('#physical-percentageGTenT1T2Diff').text(percentagePhysicalT1T2.toFixed(2) + "%");
                    $('#informatics-percentageGTenT1T2Diff').text(percentageInformaticsT1T2.toFixed(2) + "%");
                    $('#fine-percentageGTenT1T2Diff').text(percentageFineT1T2.toFixed(2) + "%");
                    $('#music-percentageGTenT1T2Diff').text(percentageMusicT1T2.toFixed(2) + "%");
                    $('#athletic-percentageGTenT1T2Diff').text(percentageAthleticT1T2.toFixed(2) + "%");
                    $('#rate-percentageGTenT1T2Diff').text(percentageRateT1T2.toFixed(2) + "%");

                    // paired simple t test
                    // Import the ttest function from simple-statistics
                    // Initialize arrays to store Arabic scores for each period

                    const arabicScoresT1 = [];
                    const amazighScoresT1 = [];
                    const frenchScoresT1 = [];
                    const englishScoresT1 = [];
                    const islamicScoresT1 = [];
                    const civicsScoresT1 = [];
                    const historyandgeographyScoresT1 = [];
                    const mathScoresT1 = [];
                    const natureScoresT1 = [];
                    const physicalScoresT1 = [];
                    const informaticsScoresT1 = [];
                    const fineScoresT1 = [];
                    const musicScoresT1 = [];
                    const athleticScoresT1 = [];
                    const rateScoresT1 = [];

                    const arabicScoresT2 = [];
                    const amazighScoresT2 = [];
                    const frenchScoresT2 = [];
                    const englishScoresT2 = [];
                    const islamicScoresT2 = [];
                    const civicsScoresT2 = [];
                    const historyandgeographyScoresT2 = [];
                    const mathScoresT2 = [];
                    const natureScoresT2 = [];
                    const physicalScoresT2 = [];
                    const informaticsScoresT2 = [];
                    const fineScoresT2 = [];
                    const musicScoresT2 = [];
                    const athleticScoresT2 = [];
                    const rateScoresT2 = [];

                    // Iterate over each row of the table
                    table.rows().every(function() {
                        const rowData = this.data();

                        // Extract Arabic score for period 1
                        const arabicValueT1 = parseFloat(rowData['اللغة العربية ف 1']) || 0;
                        const amazighValueT1 = parseFloat(rowData['اللغة اﻷمازيغية ف 1']) || 0;
                        const frenchValueT1 = parseFloat(rowData['اللغة الفرنسية ف 1']) || 0;
                        const englishValueT1 = parseFloat(rowData['اللغة الإنجليزية ف 1']) || 0;
                        const islamicValueT1 = parseFloat(rowData['التربية الإسلامية ف 1']) || 0;
                        const civicsValueT1 = parseFloat(rowData['التربية المدنية ف 1']) || 0;
                        const historyandgeographyValueT1 = parseFloat(rowData['التاريخ والجغرافيا ف 1']) || 0;
                        const mathValueT1 = parseFloat(rowData['الرياضيات ف 1']) || 0;
                        const natureValueT1 = parseFloat(rowData['ع الطبيعة و الحياة ف 1']) || 0;
                        const physicalValueT1 = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 1']) || 0;
                        const informaticsValueT1 = parseFloat(rowData['المعلوماتية ف 1']) || 0;
                        const fineValueT1 = parseFloat(rowData['التربية التشكيلية ف 1']) || 0;
                        const musicValueT1 = parseFloat(rowData['التربية الموسيقية ف 1']) || 0;
                        const athleticValueT1 = parseFloat(rowData['ت البدنية و الرياضية ف 1']) || 0;
                        const rateValueT1 = parseFloat(rowData['معدل الفصل 1']) || 0;

                        // Extract Arabic score for period 2
                        const arabicValueT2 = parseFloat(rowData['اللغة العربية ف 2']) || 0;
                        const amazighValueT2 = parseFloat(rowData['اللغة اﻷمازيغية ف 2']) || 0;
                        const frenchValueT2 = parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
                        const englishValueT2 = parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
                        const islamicValueT2 = parseFloat(rowData['التربية الإسلامية ف 2']) || 0;
                        const civicsValueT2 = parseFloat(rowData['التربية المدنية ف 2']) || 0;
                        const historyandgeographyValueT2 = parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
                        const mathValueT2 = parseFloat(rowData['الرياضيات ف 2']) || 0;
                        const natureValueT2 = parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
                        const physicalValueT2 = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                        const informaticsValueT2 = parseFloat(rowData['المعلوماتية ف 2']) || 0;
                        const fineValueT2 = parseFloat(rowData['التربية التشكيلية ف 2']) || 0;
                        const musicValueT2 = parseFloat(rowData['التربية الموسيقية ف 2']) || 0;
                        const athleticValueT2 = parseFloat(rowData['ت البدنية و الرياضية ف 2']) || 0;
                        const rateValueT2 = parseFloat(rowData['معدل الفصل 2']) || 0;

                        // Push the T1 scores to respective arrays
                        arabicScoresT1.push(arabicValueT1);
                        amazighScoresT1.push(amazighValueT1);
                        frenchScoresT1.push(frenchValueT1);
                        englishScoresT1.push(englishValueT1);
                        islamicScoresT1.push(islamicValueT1);
                        civicsScoresT1.push(civicsValueT1);
                        historyandgeographyScoresT1.push(historyandgeographyValueT1);
                        mathScoresT1.push(mathValueT1);
                        natureScoresT1.push(natureValueT1);
                        physicalScoresT1.push(physicalValueT1);
                        informaticsScoresT1.push(informaticsValueT1);
                        fineScoresT1.push(fineValueT1);
                        musicScoresT1.push(musicValueT1);
                        athleticScoresT1.push(athleticValueT1);
                        rateScoresT1.push(rateValueT1);

                        // Push the T2 scores to respective arrays
                        arabicScoresT2.push(arabicValueT2);
                        amazighScoresT2.push(amazighValueT2);
                        frenchScoresT2.push(frenchValueT2);
                        englishScoresT2.push(englishValueT2);
                        islamicScoresT2.push(islamicValueT2);
                        civicsScoresT2.push(civicsValueT2);
                        historyandgeographyScoresT2.push(historyandgeographyValueT2);
                        mathScoresT2.push(mathValueT2);
                        natureScoresT2.push(natureValueT2);
                        physicalScoresT2.push(physicalValueT2);
                        informaticsScoresT2.push(informaticsValueT2);
                        fineScoresT2.push(fineValueT2);
                        musicScoresT2.push(musicValueT2);
                        athleticScoresT2.push(athleticValueT2);
                        rateScoresT2.push(rateValueT2);
                    });

                    // Calculate the differences between the paired observations
                    const arabicdifference = arabicScoresT1.map((value, index) => value - arabicScoresT2[index]);
                    const amazighdifference = amazighScoresT1.map((value, index) => value - amazighScoresT2[index]);
                    const frenchdifference = frenchScoresT1.map((value, index) => value - frenchScoresT2[index]);
                    const englishdifference = englishScoresT1.map((value, index) => value - englishScoresT2[index]);
                    const islamicdifference = islamicScoresT1.map((value, index) => value - islamicScoresT2[index]);
                    const civicsdifference = civicsScoresT1.map((value, index) => value - civicsScoresT2[index]);
                    const historyandgeographydifference = historyandgeographyScoresT1.map((value, index) => value - historyandgeographyScoresT2[index]);
                    const mathdifference = mathScoresT1.map((value, index) => value - mathScoresT2[index]);
                    const naturedifference = natureScoresT1.map((value, index) => value - natureScoresT2[index]);
                    const physicaldifference = physicalScoresT1.map((value, index) => value - physicalScoresT2[index]);
                    const informaticsdifference = informaticsScoresT1.map((value, index) => value - informaticsScoresT2[index]);
                    const finedifference = fineScoresT1.map((value, index) => value - fineScoresT2[index]);
                    const musicdifference = musicScoresT1.map((value, index) => value - musicScoresT2[index]);
                    const athleticdifference = athleticScoresT1.map((value, index) => value - athleticScoresT2[index]);
                    const ratedifference = rateScoresT1.map((value, index) => value - rateScoresT2[index]);

                    // Calculate the mean of the differences
                    const arabicdifferencemean = meanSimple(arabicdifference);
                    const amazighdifferencemean = meanSimple(amazighdifference);
                    const frenchdifferencemean = meanSimple(frenchdifference);
                    const englishdifferencemean = meanSimple(englishdifference);
                    const islamicdifferencemean = meanSimple(islamicdifference);
                    const civicsdifferencemean = meanSimple(civicsdifference);
                    const historyandgeographydifferencemean = meanSimple(historyandgeographydifference);
                    const mathdifferencemean = meanSimple(mathdifference);
                    const naturedifferencemean = meanSimple(naturedifference);
                    const physicaldifferencemean = meanSimple(physicaldifference);
                    const informaticsdifferencemean = meanSimple(informaticsdifference);
                    const finedifferencemean = meanSimple(finedifference);
                    const musicdifferencemean = meanSimple(musicdifference);
                    const athleticdifferencemean = meanSimple(athleticdifference);
                    const ratedifferencemean = meanSimple(ratedifference);

                    // Calculate the standard deviation of the differences
                    const arabicdifferencestdDev = sampleStandardDeviation(arabicdifference);
                    const amazighdifferencestdDev = sampleStandardDeviation(amazighdifference);
                    const frenchdifferencestdDev = sampleStandardDeviation(frenchdifference);
                    const englishdifferencestdDev = sampleStandardDeviation(englishdifference);
                    const islamicdifferencestdDev = sampleStandardDeviation(islamicdifference);
                    const civicsdifferencestdDev = sampleStandardDeviation(civicsdifference);
                    const historyandgeographydifferencestdDev = sampleStandardDeviation(historyandgeographydifference);
                    const mathdifferencestdDev = sampleStandardDeviation(mathdifference);
                    const naturedifferencestdDev = sampleStandardDeviation(naturedifference);
                    const physicaldifferencestdDev = sampleStandardDeviation(physicaldifference);
                    const informaticsdifferencestdDev = sampleStandardDeviation(informaticsdifference);
                    const finedifferencestdDev = sampleStandardDeviation(finedifference);
                    const musicdifferencestdDev = sampleStandardDeviation(musicdifference);
                    const athleticdifferencestdDev = sampleStandardDeviation(athleticdifference);
                    const ratedifferencestdDev = sampleStandardDeviation(ratedifference);

                    // Calculate the number of pairs
                    const arabicN = arabicdifference.length;
                    const amazighN = amazighdifference.length;
                    const frenchN = frenchdifference.length;
                    const englishN = englishdifference.length;
                    const islamicN = islamicdifference.length;
                    const civicsN = civicsdifference.length;
                    const historyandgeographyN = historyandgeographydifference.length;
                    const mathN = mathdifference.length;
                    const natureN = naturedifference.length;
                    const physicalN = physicaldifference.length;
                    const informaticsN = informaticsdifference.length;
                    const fineN = finedifference.length;
                    const musicN = musicdifference.length;
                    const athleticN = athleticdifference.length;
                    const rateN = ratedifference.length;

                    // Calculate the t-statistic
                    const arabictStatistic = arabicdifferencemean / (arabicdifferencestdDev / Math.sqrt(arabicN));
                    const amazightStatistic = amazighdifferencemean / (amazighdifferencestdDev / Math.sqrt(amazighN));
                    const frenchtStatistic = frenchdifferencemean / (frenchdifferencestdDev / Math.sqrt(frenchN));
                    const englishtStatistic = englishdifferencemean / (englishdifferencestdDev / Math.sqrt(englishN));
                    const islamictStatistic = islamicdifferencemean / (islamicdifferencestdDev / Math.sqrt(islamicN));
                    const civicstStatistic = civicsdifferencemean / (civicsdifferencestdDev / Math.sqrt(civicsN));
                    const historyandgeographytStatistic = historyandgeographydifferencemean / (historyandgeographydifferencestdDev / Math.sqrt(historyandgeographyN));
                    const mathtStatistic = mathdifferencemean / (mathdifferencestdDev / Math.sqrt(mathN));
                    const naturetStatistic = naturedifferencemean / (naturedifferencestdDev / Math.sqrt(natureN));
                    const physicaltStatistic = physicaldifferencemean / (physicaldifferencestdDev / Math.sqrt(physicalN));
                    const informaticstStatistic = informaticsdifferencemean / (informaticsdifferencestdDev / Math.sqrt(informaticsN));
                    const finetStatistic = finedifferencemean / (finedifferencestdDev / Math.sqrt(fineN));
                    const musictStatistic = musicdifferencemean / (musicdifferencestdDev / Math.sqrt(musicN));
                    const athletictStatistic = athleticdifferencemean / (athleticdifferencestdDev / Math.sqrt(athleticN));
                    const ratetStatistic = ratedifferencemean / (ratedifferencestdDev / Math.sqrt(rateN));

                    // Calculate the degrees of freedom
                    const arabicdf = arabicN - 1;
                    const amazighdf = amazighN - 1;
                    const frenchdf = frenchN - 1;
                    const englishdf = englishN - 1;
                    const islamicdf = islamicN - 1;
                    const civicsdf = civicsN - 1;
                    const historyandgeographydf = historyandgeographyN - 1;
                    const mathdf = mathN - 1;
                    const naturedf = natureN - 1;
                    const physicaldf = physicalN - 1;
                    const informaticsdf = informaticsN - 1;
                    const finedf = fineN - 1;
                    const musicdf = musicN - 1;
                    const athleticdf = athleticN - 1;
                    const ratedf = rateN - 1;

                    // Calculate the p-value
                    const arabicpValue = 2 * (1 - jStat.studentt.cdf(Math.abs(arabictStatistic), arabicdf));
                    const amazighpValue = 2 * (1 - jStat.studentt.cdf(Math.abs(amazightStatistic), amazighdf));
                    const frenchpValue = 2 * (1 - jStat.studentt.cdf(Math.abs(frenchtStatistic), frenchdf));
                    const englishpValue = 2 * (1 - jStat.studentt.cdf(Math.abs(englishtStatistic), englishdf));
                    const islamicpValue = 2 * (1 - jStat.studentt.cdf(Math.abs(islamictStatistic), islamicdf));
                    const civicspValue = 2 * (1 - jStat.studentt.cdf(Math.abs(civicstStatistic), civicsdf));
                    const historyandgeographypValue = 2 * (1 - jStat.studentt.cdf(Math.abs(historyandgeographytStatistic), historyandgeographydf));
                    const mathpValue = 2 * (1 - jStat.studentt.cdf(Math.abs(mathtStatistic), mathdf));
                    const naturepValue = 2 * (1 - jStat.studentt.cdf(Math.abs(naturetStatistic), naturedf));
                    const physicalpValue = 2 * (1 - jStat.studentt.cdf(Math.abs(physicaltStatistic), physicaldf));
                    const informaticspValue = 2 * (1 - jStat.studentt.cdf(Math.abs(informaticstStatistic), informaticsdf));
                    const finepValue = 2 * (1 - jStat.studentt.cdf(Math.abs(finetStatistic), finedf));
                    const musicpValue = 2 * (1 - jStat.studentt.cdf(Math.abs(musictStatistic), musicdf));
                    const athleticpValue = 2 * (1 - jStat.studentt.cdf(Math.abs(athletictStatistic), athleticdf));
                    const ratepValue = 2 * (1 - jStat.studentt.cdf(Math.abs(ratetStatistic), ratedf));

                    if (arabicpValue > 0.050) {
                    $('#arabic-pValueNote').text("لا توجد فروق");
                    } else if (arabicpValue <= 0.050) {
                        $('#arabic-pValueNote').text("توجد فروق");
                    } else {
                        $('#arabic-pValueNote').text("-");
                    }
                    if (amazighpValue > 0.050) {
                        $('#amazigh-,pValueNote').text("لا توجد فروق");
                    } else if (amazighpValue <= 0.050) {
                        $('#amazigh-pValueNote').text("توجد فروق");
                    } else {
                        $('#amazigh-pValueNote').text("-");
                    }
                    if (frenchpValue > 0.050) {
                        $('#french-pValueNote').text("لا توجد فروق");
                    } else if (frenchpValue <= 0.050) {
                        $('#french-pValueNote').text("توجد فروق");
                    } else {
                        $('#french-pValueNote').text("-");
                    }
                    if (englishpValue > 0.050) {
                        $('#english-pValueNote').text("لا توجد فروق");
                    } else if (englishpValue <= 0.050) {
                        $('#english-pValueNote').text("توجد فروق");
                    } else {
                        $('#english-pValueNote').text("-");
                    }
                    if (islamicpValue > 0.050) {
                        $('#islamic-pValueNote').text("لا توجد فروق");
                    } else if (islamicpValue <= 0.050) {
                        $('#islamic-pValueNote').text("توجد فروق");
                    } else {
                        $('#islamic-pValueNote').text("-");
                    }
                    if (civicspValue > 0.050) {
                        $('#civics-pValueNote').text("لا توجد فروق");
                    } else if (civicspValue <= 0.050) {
                        $('#civics-pValueNote').text("توجد فروق");
                    } else {
                        $('#civics-pValueNote').text("-");
                    }
                    if (historyandgeographypValue > 0.050) {
                        $('#historyandgeography-pValueNote').text("لا توجد فروق");
                    } else if (historyandgeographypValue <= 0.050) {
                        $('#historyandgeography-pValueNote').text("توجد فروق");
                    } else {
                        $('#historyandgeography-pValueNote').text("-");
                    }
                    if (mathpValue > 0.050) {
                        $('#math-pValueNote').text("لا توجد فروق");
                    } else if (mathpValue <= 0.050) {
                        $('#math-pValueNote').text("توجد فروق");
                    } else {
                        $('#math-pValueNote').text("-");
                    }
                    if (naturepValue > 0.050) {
                        $('#nature-pValueNote').text("لا توجد فروق");
                    } else if (naturepValue <= 0.050) {
                        $('#nature-pValueNote').text("توجد فروق");
                    } else {
                        $('#nature-pValueNote').text("-");
                    }
                    if (physicalpValue > 0.050) {
                        $('#physical-pValueNote').text("لا توجد فروق");
                    } else if (physicalpValue <= 0.050) {
                        $('#physical-pValueNote').text("توجد فروق");
                    } else {
                        $('#physical-pValueNote').text("-");
                    }
                    if (informaticspValue > 0.050) {
                        $('#informatics-pValueNote').text("لا توجد فروق");
                    } else if (informaticspValue <= 0.050) {
                        $('#informatics-pValueNote').text("توجد فروق");
                    } else {
                        $('#informatics-pValueNote').text("-");
                    }
                    if (finepValue > 0.050) {
                        $('#fine-pValueNote').text("لا توجد فروق");
                    } else if (finepValue <= 0.050) {
                        $('#fine-pValueNote').text("توجد فروق");
                    } else {
                        $('#fine-pValueNote').text("-");
                    }
                    if (musicpValue > 0.050) {
                        $('#music-pValueNote').text("لا توجد فروق");
                    } else if (musicpValue <= 0.050) {
                        $('#music-pValueNote').text("توجد فروق");
                    } else {
                        $('#music-pValueNote').text("-");
                    }
                    if (athleticpValue > 0.050) {
                        $('#athletic-pValueNote').text("لا توجد فروق");
                    } else if (athleticpValue <= 0.050) {
                        $('#athletic-pValueNote').text("توجد فروق");
                    } else {
                        $('#athletic-pValueNote').text("-");
                    }
                    if (ratepValue > 0.050) {
                        $('#rate-pValueNote').text("لا توجد فروق");
                    } else if (ratepValue <= 0.050) {
                        $('#rate-pValueNote').text("توجد فروق");
                    } else {
                        $('#rate-pValueNote').text("-");
                    }


                    // Update the content of the HTML elements with the pValue
                    $('#arabic-pValue').text(!isNaN(arabicpValue) ? arabicpValue.toFixed(2) : '-');
                    $('#amazigh-pValue').text(!isNaN(amazighpValue) ? amazighpValue.toFixed(2) : '-');
                    $('#french-pValue').text(!isNaN(frenchpValue) ? frenchpValue.toFixed(2) : '-');
                    $('#english-pValue').text(!isNaN(englishpValue) ? englishpValue.toFixed(2) : '-');
                    $('#islamic-pValue').text(!isNaN(islamicpValue) ? islamicpValue.toFixed(2) : '-');
                    $('#civics-pValue').text(!isNaN(civicspValue) ? civicspValue.toFixed(2) : '-');
                    $('#historyandgeography-pValue').text(!isNaN(historyandgeographypValue) ? historyandgeographypValue.toFixed(2) : '-');
                    $('#math-pValue').text(!isNaN(mathpValue) ? mathpValue.toFixed(2) : '-');
                    $('#nature-pValue').text(!isNaN(naturepValue) ? naturepValue.toFixed(2) : '-');
                    $('#physical-pValue').text(!isNaN(physicalpValue) ? physicalpValue.toFixed(2) : '-');
                    $('#informatics-pValue').text(!isNaN(informaticspValue) ? informaticspValue.toFixed(2) : '-');
                    $('#fine-pValue').text(!isNaN(finepValue) ? finepValue.toFixed(2) : '-');
                    $('#music-pValue').text(!isNaN(musicpValue) ? musicpValue.toFixed(2) : '-');
                    $('#athletic-pValue').text(!isNaN(athleticpValue) ? athleticpValue.toFixed(2) : '-');
                    $('#rate-pValue').text(!isNaN(ratepValue) ? ratepValue.toFixed(2) : '-');

            // Coefficient of Variation (CV)
            // Coefficient complet table
            // Initialize variables to hold the sum of values for each subject
            let cvsumArabic = 0;
            let cvsumAmazigh = 0;
            let cvsumFrench = 0;
            let cvsumEnglish = 0;
            let cvsumIslamic = 0;
            let cvsumCivics = 0;
            let cvsumHistoryAndGeography = 0;
            let cvsumMath = 0;
            let cvsumNature = 0;
            let cvsumPhysical = 0;
            let cvsumInformatics = 0;
            let cvsumFine = 0;
            let cvsumMusic = 0;
            let cvsumAthletic = 0;
            let cvsumRate = 0;

            let cvsumSquaredDiffArabic = 0;
            let cvsumSquaredDiffAmazigh = 0;
            let cvsumSquaredDiffFrench = 0;
            let cvsumSquaredDiffEnglish = 0;
            let cvsumSquaredDiffIslamic = 0;
            let cvsumSquaredDiffCivics = 0;
            let cvsumSquaredDiffHistoryAndGeography = 0;
            let cvsumSquaredDiffMath = 0;
            let cvsumSquaredDiffNature = 0;
            let cvsumSquaredDiffPhysical = 0;
            let cvsumSquaredDiffInformatics = 0;
            let cvsumSquaredDiffFine = 0;
            let cvsumSquaredDiffMusic = 0;
            let cvsumSquaredDiffAthletic = 0;
            let cvsumSquaredDiffRate = 0;

            // Calculate the sum for each subject
                table.rows().every(function() {
                    const rowData = this.data();

                cvsumArabic += parseFloat(rowData['اللغة العربية ف 2']) || 0;
                cvsumAmazigh += parseFloat(rowData['اللغة اﻷمازيغية ف 2']) || 0;
                cvsumFrench += parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
                cvsumEnglish += parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
                cvsumIslamic += parseFloat(rowData['التربية الإسلامية ف 2']) || 0;
                cvsumCivics += parseFloat(rowData['التربية المدنية ف 2']) || 0;
                cvsumHistoryAndGeography += parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
                cvsumMath += parseFloat(rowData['الرياضيات ف 2']) || 0;
                cvsumNature += parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
                cvsumPhysical += parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                cvsumInformatics += parseFloat(rowData['المعلوماتية ف 2']) || 0;
                cvsumFine += parseFloat(rowData['التربية التشكيلية ف 2']) || 0;
                cvsumMusic += parseFloat(rowData['التربية الموسيقية ف 2']) || 0;
                cvsumAthletic += parseFloat(rowData['ت البدنية و الرياضية ف 2']) || 0;
                cvsumRate += parseFloat(rowData['معدل الفصل 2']) || 0;

                    return true;
            });

                // Calculate the mean (average) for each subject
            let cvmeanArabic = cvsumArabic / totalRows;
            let cvmeanAmazigh = cvsumAmazigh / totalRows;
            let cvmeanFrench = cvsumFrench / totalRows;
            let cvmeanEnglish = cvsumEnglish / totalRows;
            let cvmeanIslamic = cvsumIslamic / totalRows;
            let cvmeanCivics = cvsumCivics / totalRows;
            let cvmeanHistoryAndGeography = cvsumHistoryAndGeography / totalRows;
            let cvmeanMath = cvsumMath / totalRows;
            let cvmeanNature = cvsumNature / totalRows;
            let cvmeanPhysical = cvsumPhysical / totalRows;
            let cvmeanInformatics = cvsumInformatics / totalRows;
            let cvmeanFine = cvsumFine / totalRows;
            let cvmeanMusic = cvsumMusic / totalRows;
            let cvmeanAthletic = cvsumAthletic / totalRows;
            let cvmeanRate = cvsumRate / totalRows;

            // Iterate over each row to sum up the values for each subject
            table.rows().every(function() {
                const rowData = this.data();

                const arabicValue = parseFloat(rowData['اللغة العربية ف 2']) || 0;
                const amazighValue = parseFloat(rowData['اللغة اﻷمازيغية ف 2']) || 0;
                const frenchValue = parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
                const englishValue = parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
                const islamicValue = parseFloat(rowData['التربية الإسلامية ف 2']) || 0;
                const civicsValue = parseFloat(rowData['التربية المدنية ف 2']) || 0;
                const historyandgeographyValue = parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
                const mathValue = parseFloat(rowData['الرياضيات ف 2']) || 0;
                const natureValue = parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
                const physicalValue = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                const informaticsValue = parseFloat(rowData['المعلوماتية ف 2']) || 0;
                const fineValue = parseFloat(rowData['التربية التشكيلية ف 2']) || 0;
                const musicValue = parseFloat(rowData['التربية الموسيقية ف 2']) || 0;
                const athleticValue = parseFloat(rowData['ت البدنية و الرياضية ف 2']) || 0;
                const rateValue = parseFloat(rowData['معدل الفصل 2']) || 0;

                // Calculate the squared differences and add them to the sum
                cvsumSquaredDiffArabic += Math.pow(arabicValue - cvmeanArabic, 2);
                cvsumSquaredDiffAmazigh += Math.pow(amazighValue - cvmeanAmazigh, 2);
                cvsumSquaredDiffFrench += Math.pow(frenchValue - cvmeanFrench, 2);
                cvsumSquaredDiffEnglish += Math.pow(englishValue - cvmeanEnglish, 2);
                cvsumSquaredDiffIslamic += Math.pow(islamicValue - cvmeanIslamic, 2);
                cvsumSquaredDiffCivics += Math.pow(civicsValue - cvmeanCivics, 2);
                cvsumSquaredDiffHistoryAndGeography += Math.pow(historyandgeographyValue - cvmeanHistoryAndGeography, 2);
                cvsumSquaredDiffMath += Math.pow(mathValue - cvmeanMath, 2);
                cvsumSquaredDiffNature += Math.pow(natureValue - cvmeanNature, 2);
                cvsumSquaredDiffPhysical += Math.pow(physicalValue - cvmeanPhysical, 2);
                cvsumSquaredDiffInformatics += Math.pow(informaticsValue - cvmeanInformatics, 2);
                cvsumSquaredDiffFine += Math.pow(fineValue - cvmeanFine, 2);
                cvsumSquaredDiffMusic += Math.pow(musicValue - cvmeanMusic, 2);
                cvsumSquaredDiffAthletic += Math.pow(athleticValue - cvmeanAthletic, 2);
                cvsumSquaredDiffRate += Math.pow(rateValue - cvmeanRate, 2);

                return true;

            });

            // Calculate the standard deviation for each subject
            let cvstdvArabic = Math.sqrt(cvsumSquaredDiffArabic / (totalRows - 1));
            let cvstdvAmazigh = Math.sqrt(cvsumSquaredDiffAmazigh / (totalRows - 1));
            let cvstdvFrench = Math.sqrt(cvsumSquaredDiffFrench / (totalRows - 1));
            let cvstdvEnglish = Math.sqrt(cvsumSquaredDiffEnglish / (totalRows - 1));
            let cvstdvIslamic = Math.sqrt(cvsumSquaredDiffIslamic / (totalRows - 1));
            let cvstdvCivics = Math.sqrt(cvsumSquaredDiffCivics / (totalRows - 1));
            let cvstdvHistoryAndGeography = Math.sqrt(cvsumSquaredDiffHistoryAndGeography / (totalRows - 1));
            let cvstdvMath = Math.sqrt(cvsumSquaredDiffMath / (totalRows - 1));
            let cvstdvNature = Math.sqrt(cvsumSquaredDiffNature / (totalRows - 1));
            let cvstdvPhysical = Math.sqrt(cvsumSquaredDiffPhysical / (totalRows - 1));
            let cvstdvInformatics = Math.sqrt(cvsumSquaredDiffInformatics / (totalRows - 1));
            let cvstdvFine = Math.sqrt(cvsumSquaredDiffFine / (totalRows - 1));
            let cvstdvMusic = Math.sqrt(cvsumSquaredDiffMusic / (totalRows - 1));
            let cvstdvAthletic = Math.sqrt(cvsumSquaredDiffAthletic / (totalRows - 1));
            let cvstdvRate = Math.sqrt(cvsumSquaredDiffRate / (totalRows - 1));

            let cvArabic = totalRows > 0 ? (cvstdvArabic / cvmeanArabic) * 100 : 0; 
            let cvAmazigh = totalRows > 0 ? (cvstdvAmazigh / cvmeanAmazigh) * 100 : 0;
            let cvFrench = totalRows > 0 ? (cvstdvFrench / cvmeanFrench) * 100 : 0;
            let cvEnglish = totalRows > 0 ? (cvstdvEnglish / cvmeanEnglish) * 100 : 0;
            let cvIslamic = totalRows > 0 ? (cvstdvIslamic / cvmeanIslamic) * 100 : 0;
            let cvCivics = totalRows > 0 ? (cvstdvCivics / cvmeanCivics) * 100 : 0;
            let cvHistoryAndGeography = totalRows > 0 ? (cvstdvHistoryAndGeography / cvmeanHistoryAndGeography) * 100 : 0;
            let cvMath = totalRows > 0 ? (cvstdvMath / cvmeanMath) * 100 : 0;
            let cvNature = totalRows > 0 ? (cvstdvNature / cvmeanNature) * 100 : 0;
            let cvPhysical = totalRows > 0 ? (cvstdvPhysical / cvmeanPhysical) * 100 : 0;
            let cvInformatics = totalRows > 0 ? (cvstdvInformatics / cvmeanInformatics) * 100 : 0;
            let cvFine = totalRows > 0 ? (cvstdvFine / cvmeanFine) * 100 : 0;
            let cvMusic = totalRows > 0 ? (cvstdvMusic / cvmeanMusic) * 100 : 0;
            let cvAthletic = totalRows > 0 ? (cvstdvAthletic / cvmeanAthletic) * 100 : 0;
            let cvRate = totalRows > 0 ? (cvstdvRate / cvmeanRate) * 100 : 0;

            let cvArabicG1 = Math.abs((cvstdvArabic * 3 / 2) - cvmeanArabic); 
            let cvAmazighG1 = Math.abs((cvstdvAmazigh * 3 / 2) - cvmeanAmazigh);
            let cvFrenchG1 = Math.abs((cvstdvFrench * 3 / 2) - cvmeanFrench);
            let cvEnglishG1 = Math.abs((cvstdvEnglish * 3 / 2) - cvmeanEnglish);
            let cvIslamicG1 = Math.abs((cvstdvIslamic * 3 / 2) - cvmeanIslamic);
            let cvCivicsG1 = Math.abs((cvstdvCivics * 3 / 2) - cvmeanCivics);
            let cvHistoryAndGeographyG1 = Math.abs((cvstdvHistoryAndGeography * 3 / 2) - cvmeanHistoryAndGeography);
            let cvMathG1 = Math.abs((cvstdvMath * 3 / 2) - cvmeanMath);
            let cvNatureG1 = Math.abs((cvstdvNature * 3 / 2) - cvmeanNature);
            let cvPhysicalG1 = Math.abs((cvstdvPhysical * 3 / 2) - cvmeanPhysical);
            let cvInformaticsG1 = Math.abs((cvstdvInformatics * 3 / 2) - cvmeanInformatics);
            let cvFineG1 = Math.abs((cvstdvFine * 3 / 2) - cvmeanFine);
            let cvMusicG1 = Math.abs((cvstdvMusic * 3 / 2) - cvmeanMusic);
            let cvAthleticG1 = Math.abs((cvstdvAthletic * 3 / 2) - cvmeanAthletic);
            let cvRateG1 = Math.abs((cvstdvRate * 3 / 2) - cvmeanRate);

            let cvArabicG2 = Math.abs((cvstdvArabic * 1 / 2) - cvmeanArabic); 
            let cvAmazighG2 = Math.abs((cvstdvAmazigh * 1 / 2) - cvmeanAmazigh);
            let cvFrenchG2 = Math.abs((cvstdvFrench * 1 / 2) - cvmeanFrench);
            let cvEnglishG2 = Math.abs((cvstdvEnglish * 1 / 2) - cvmeanEnglish);
            let cvIslamicG2 = Math.abs((cvstdvIslamic * 1 / 2) - cvmeanIslamic);
            let cvCivicsG2 = Math.abs((cvstdvCivics * 1 / 2) - cvmeanCivics);
            let cvHistoryAndGeographyG2 = Math.abs((cvstdvHistoryAndGeography * 1 / 2) - cvmeanHistoryAndGeography);
            let cvMathG2 = Math.abs((cvstdvMath * 1 / 2) - cvmeanMath);
            let cvNatureG2 = Math.abs((cvstdvNature * 1 / 2) - cvmeanNature);
            let cvPhysicalG2 = Math.abs((cvstdvPhysical * 1 / 2) - cvmeanPhysical);
            let cvInformaticsG2 = Math.abs((cvstdvInformatics * 1 / 2) - cvmeanInformatics);
            let cvFineG2 = Math.abs((cvstdvFine * 1 / 2) - cvmeanFine);
            let cvMusicG2 = Math.abs((cvstdvMusic * 1 / 2) - cvmeanMusic);
            let cvAthleticG2 = Math.abs((cvstdvAthletic * 1 / 2) - cvmeanAthletic);
            let cvRateG2 = Math.abs((cvstdvRate * 1 / 2) - cvmeanRate);

            let cvArabicG3 = Math.abs((cvstdvArabic * 1 / 2) + cvmeanArabic); 
            let cvAmazighG3 = Math.abs((cvstdvAmazigh * 1 / 2) + cvmeanAmazigh);
            let cvFrenchG3 = Math.abs((cvstdvFrench * 1 / 2) + cvmeanFrench);
            let cvEnglishG3 = Math.abs((cvstdvEnglish * 1 / 2) + cvmeanEnglish);
            let cvIslamicG3 = Math.abs((cvstdvIslamic * 1 / 2) + cvmeanIslamic);
            let cvCivicsG3 = Math.abs((cvstdvCivics * 1 / 2) + cvmeanCivics);
            let cvHistoryAndGeographyG3 = Math.abs((cvstdvHistoryAndGeography * 1 / 2) + cvmeanHistoryAndGeography);
            let cvMathG3 = Math.abs((cvstdvMath * 1 / 2) + cvmeanMath);
            let cvNatureG3 = Math.abs((cvstdvNature * 1 / 2) + cvmeanNature);
            let cvPhysicalG3 = Math.abs((cvstdvPhysical * 1 / 2) + cvmeanPhysical);
            let cvInformaticsG3 = Math.abs((cvstdvInformatics * 1 / 2) + cvmeanInformatics);
            let cvFineG3 = Math.abs((cvstdvFine * 1 / 2) + cvmeanFine);
            let cvMusicG3 = Math.abs((cvstdvMusic * 1 / 2) + cvmeanMusic);
            let cvAthleticG3 = Math.abs((cvstdvAthletic * 1 / 2) + cvmeanAthletic);
            let cvRateG3 = Math.abs((cvstdvRate * 1 / 2) + cvmeanRate);

            let cvArabicG4 = Math.abs((cvstdvArabic * 2 / 2) + cvmeanArabic); 
            let cvAmazighG4 = Math.abs((cvstdvAmazigh * 2 / 2) + cvmeanAmazigh);
            let cvFrenchG4 = Math.abs((cvstdvFrench * 2 / 2) + cvmeanFrench);
            let cvEnglishG4 = Math.abs((cvstdvEnglish * 2 / 2) + cvmeanEnglish);
            let cvIslamicG4 = Math.abs((cvstdvIslamic * 2 / 2) + cvmeanIslamic);
            let cvCivicsG4 = Math.abs((cvstdvCivics * 2 / 2) + cvmeanCivics);
            let cvHistoryAndGeographyG4 = Math.abs((cvstdvHistoryAndGeography * 2 / 2) + cvmeanHistoryAndGeography);
            let cvMathG4 = Math.abs((cvstdvMath * 2 / 2) + cvmeanMath);
            let cvNatureG4 = Math.abs((cvstdvNature * 2 / 2) + cvmeanNature);
            let cvPhysicalG4 = Math.abs((cvstdvPhysical * 2 / 2) + cvmeanPhysical);
            let cvInformaticsG4 = Math.abs((cvstdvInformatics * 2 / 2) + cvmeanInformatics);
            let cvFineG4 = Math.abs((cvstdvFine * 2 / 2) + cvmeanFine);
            let cvMusicG4 = Math.abs((cvstdvMusic * 2 / 2) + cvmeanMusic);
            let cvAthleticG4 = Math.abs((cvstdvAthletic * 2 / 2) + cvmeanAthletic);
            let cvRateG4 = Math.abs((cvstdvRate * 2 / 2) + cvmeanRate);


            // Count the number of values greater than 1 in 'اللغة العربية' and 'اللغة اﻷمازيغية'
            let countarabicWeak = 0;
            let countamazighWeak = 0;
            let countfrenchWeak = 0;
            let countenglishWeak = 0;
            let countislamicWeak = 0;
            let countcivicsWeak = 0;
            let counthistoryandgeographyWeak = 0;
            let countmathWeak = 0;
            let countnatureWeak = 0;
            let countphysicalWeak = 0;
            let countinformaticsWeak = 0;
            let countfineWeak = 0;
            let countmusicWeak = 0;
            let countathleticWeak = 0;
            let countrateWeak = 0;

            let countarabicCloseto = 0;
            let countamazighCloseto = 0;
            let countfrenchCloseto = 0;
            let countenglishCloseto = 0;
            let countislamicCloseto = 0;
            let countcivicsCloseto = 0;
            let counthistoryandgeographyCloseto = 0;
            let countmathCloseto = 0;
            let countnatureCloseto = 0;
            let countphysicalCloseto = 0;
            let countinformaticsCloseto = 0;
            let countfineCloseto = 0;
            let countmusicCloseto = 0;
            let countathleticCloseto = 0;
            let countrateCloseto = 0;

            let countarabicMedium = 0;
            let countamazighMedium = 0;
            let countfrenchMedium = 0;
            let countenglishMedium = 0;
            let countislamicMedium = 0;
            let countcivicsMedium = 0;
            let counthistoryandgeographyMedium = 0;
            let countmathMedium = 0;
            let countnatureMedium = 0;
            let countphysicalMedium = 0;
            let countinformaticsMedium = 0;
            let countfineMedium = 0;
            let countmusicMedium = 0;
            let countathleticMedium = 0;
            let countrateMedium = 0;

            let countarabicGood = 0;
            let countamazighGood = 0;
            let countfrenchGood = 0;
            let countenglishGood = 0;
            let countislamicGood = 0;
            let countcivicsGood = 0;
            let counthistoryandgeographyGood = 0;
            let countmathGood = 0;
            let countnatureGood = 0;
            let countphysicalGood = 0;
            let countinformaticsGood = 0;
            let countfineGood = 0;
            let countmusicGood = 0;
            let countathleticGood = 0;
            let countrateGood = 0;

            let countarabicVeryGood = 0;
            let countamazighVeryGood = 0;
            let countfrenchVeryGood = 0;
            let countenglishVeryGood = 0;
            let countislamicVeryGood = 0;
            let countcivicsVeryGood = 0;
            let counthistoryandgeographyVeryGood = 0;
            let countmathVeryGood = 0;
            let countnatureVeryGood = 0;
            let countphysicalVeryGood = 0;
            let countinformaticsVeryGood = 0;
            let countfineVeryGood = 0;
            let countmusicVeryGood = 0;
            let countathleticVeryGood = 0;
            let countrateVeryGood = 0;

            let countarabicCV = 0;
            let countamazighCV = 0;
            let countfrenchCV = 0;
            let countenglishCV = 0;
            let countislamicCV = 0;
            let countcivicsCV = 0;
            let counthistoryandgeographyCV = 0;
            let countmathCV = 0;
            let countnatureCV = 0;
            let countphysicalCV = 0;
            let countinformaticsCV = 0;
            let countfineCV = 0;
            let countmusicCV = 0;
            let countathleticCV = 0;
            let countrateCV = 0;

            table.rows().every(function() {
                const rowData = this.data();

                const arabicValue = parseFloat(rowData['اللغة العربية ف 2']) || 0;
                const amazighValue = parseFloat(rowData['اللغة اﻷمازيغية ف 2']) || 0;
                const frenchValue = parseFloat(rowData['اللغة الفرنسية ف 2']) || 0;
                const englishValue = parseFloat(rowData['اللغة الإنجليزية ف 2']) || 0;
                const islamicValue = parseFloat(rowData['التربية الإسلامية ف 2']) || 0;
                const civicsValue = parseFloat(rowData['التربية المدنية ف 2']) || 0;
                const historyandgeographyValue = parseFloat(rowData['التاريخ والجغرافيا ف 2']) || 0;
                const mathValue = parseFloat(rowData['الرياضيات ف 2']) || 0;
                const natureValue = parseFloat(rowData['ع الطبيعة و الحياة ف 2']) || 0;
                const physicalValue = parseFloat(rowData['ع الفيزيائية والتكنولوجيا ف 2']) || 0;
                const informaticsValue = parseFloat(rowData['المعلوماتية ف 2']) || 0;
                const fineValue = parseFloat(rowData['التربية التشكيلية ف 2']) || 0;
                const musicValue = parseFloat(rowData['التربية الموسيقية ف 2']) || 0;
                const athleticValue = parseFloat(rowData['ت البدنية و الرياضية ف 2']) || 0;
                const rateValue = parseFloat(rowData['معدل الفصل 2']) || 0;

                // Coefficient of Variation - 0 - G1
                if (arabicValue > 0 && arabicValue <= cvArabicG1) {
                    countarabicWeak++;
                }
                if (amazighValue > 0 && amazighValue <= cvAmazighG1) {
                    countamazighWeak++;
                }
                if (frenchValue > 0 && frenchValue <= cvFrenchG1) {
                    countfrenchWeak++;
                }
                if (englishValue > 0 && englishValue <= cvEnglishG1) {
                    countenglishWeak++;
                }
                if (islamicValue > 0 && islamicValue <= cvIslamicG1) {
                    countislamicWeak++;
                }
                if (civicsValue > 0 && civicsValue <= cvCivicsG1) {
                    countcivicsWeak++;
                }
                if (historyandgeographyValue > 0 && historyandgeographyValue <= cvHistoryAndGeographyG1) {
                    counthistoryandgeographyWeak++;
                }
                if (mathValue > 0 && mathValue <= cvMathG1) {
                    countmathWeak++;
                }
                if (natureValue > 0 && natureValue <= cvNatureG1) {
                    countnatureWeak++;
                }
                if (physicalValue > 0 && physicalValue <= cvPhysicalG1) {
                    countphysicalWeak++;
                }
                if (informaticsValue > 0 && informaticsValue <= cvInformaticsG1) {
                    countinformaticsWeak++;
                }
                if (fineValue > 0 && fineValue <= cvFineG1) {
                    countfineWeak++;
                }
                if (musicValue > 0 && musicValue <= cvMusicG1) {
                    countmusicWeak++;
                }
                if (athleticValue > 0 && athleticValue <= cvAthleticG1) {
                    countathleticWeak++;
                }
                if (rateValue > 0 && rateValue <= cvRateG1) {
                    countrateWeak++;
                }

                // Coefficient of Variation - G1 - G2
                if (arabicValue > cvArabicG1 && arabicValue <= cvArabicG2) {
                    countarabicCloseto++;
                }
                if (amazighValue > cvAmazighG1 && amazighValue <= cvAmazighG2) {
                    countamazighCloseto++;
                }
                if (frenchValue > cvFrenchG1 && frenchValue <= cvFrenchG2) {
                    countfrenchCloseto++;
                }
                if (englishValue > cvEnglishG1 && englishValue <= cvEnglishG2) {
                    countenglishCloseto++;
                }
                if (islamicValue > cvIslamicG1 && islamicValue <= cvIslamicG2) {
                    countislamicCloseto++;
                }
                if (civicsValue > cvCivicsG1 && civicsValue <= cvCivicsG2) {
                    countcivicsCloseto++;
                }
                if (historyandgeographyValue > cvHistoryAndGeographyG1 && historyandgeographyValue <= cvHistoryAndGeographyG2) {
                    counthistoryandgeographyCloseto++;
                }
                if (mathValue > cvMathG1 && mathValue <= cvMathG2) {
                    countmathCloseto++;
                }
                if (natureValue > cvNatureG1 && natureValue <= cvNatureG2) {
                    countnatureCloseto++;
                }
                if (physicalValue > cvPhysicalG1 && physicalValue <= cvPhysicalG2) {
                    countphysicalCloseto++;
                }
                if (informaticsValue > cvInformaticsG1 && informaticsValue <= cvInformaticsG2) {
                    countinformaticsCloseto++;
                }
                if (fineValue > cvFineG1 && fineValue <= cvFineG2) {
                    countfineCloseto++;
                }
                if (musicValue > cvMusicG1 && musicValue <= cvMusicG2) {
                    countmusicCloseto++;
                }
                if (athleticValue > cvAthleticG1 && athleticValue <= cvAthleticG2) {
                    countathleticCloseto++;
                }
                if (rateValue > cvRateG1 && rateValue <= cvRateG2) {
                    countrateCloseto++;
                }

                // Coefficient of Variation - G2 - G3
                if (arabicValue > cvArabicG2 && arabicValue <= cvArabicG3) {
                    countarabicMedium++;
                }
                if (amazighValue > cvAmazighG2 && amazighValue <= cvAmazighG3) {
                    countamazighMedium++;
                }
                if (frenchValue > cvFrenchG2 && frenchValue <= cvFrenchG3) {
                    countfrenchMedium++;
                }
                if (englishValue > cvEnglishG2 && englishValue <= cvEnglishG3) {
                    countenglishMedium++;
                }
                if (islamicValue > cvIslamicG2 && islamicValue <= cvIslamicG3) {
                    countislamicMedium++;
                }
                if (civicsValue > cvCivicsG2 && civicsValue <= cvCivicsG3) {
                    countcivicsMedium++;
                }
                if (historyandgeographyValue > cvHistoryAndGeographyG2 && historyandgeographyValue <= cvHistoryAndGeographyG3) {
                    counthistoryandgeographyMedium++;
                }
                if (mathValue > cvMathG2 && mathValue <= cvMathG3) {
                    countmathMedium++;
                }
                if (natureValue > cvNatureG2 && natureValue <= cvNatureG3) {
                    countnatureMedium++;
                }
                if (physicalValue > cvPhysicalG2 && physicalValue <= cvPhysicalG3) {
                    countphysicalMedium++;
                }
                if (informaticsValue > cvInformaticsG2 && informaticsValue <= cvInformaticsG3) {
                    countinformaticsMedium++;
                }
                if (fineValue > cvFineG2 && fineValue <= cvFineG3) {
                    countfineMedium++;
                }
                if (musicValue > cvMusicG2 && musicValue <= cvMusicG3) {
                    countmusicMedium++;
                }
                if (athleticValue > cvAthleticG2 && athleticValue <= cvAthleticG3) {
                    countathleticMedium++;
                }
                if (rateValue > cvRateG2 && rateValue <= cvRateG3) {
                    countrateMedium++;
                }

                // // Coefficient of Variation - G3 - G4
                if (arabicValue > cvArabicG3 && arabicValue <= cvArabicG4) {
                    countarabicGood++;
                }
                if (amazighValue > cvAmazighG3 && amazighValue <= cvAmazighG4) {
                    countamazighGood++;
                }
                if (frenchValue > cvFrenchG3 && frenchValue <= cvFrenchG4) {
                    countfrenchGood++;
                }
                if (englishValue > cvEnglishG3 && englishValue <= cvEnglishG4) {
                    countenglishGood++;
                }
                if (islamicValue > cvIslamicG3 && islamicValue <= cvIslamicG4) {
                    countislamicGood++;
                }
                if (civicsValue > cvCivicsG3 && civicsValue <= cvCivicsG4) {
                    countcivicsGood++;
                }
                if (historyandgeographyValue > cvHistoryAndGeographyG3 && historyandgeographyValue <= cvHistoryAndGeographyG4) {
                    counthistoryandgeographyGood++;
                }
                if (mathValue > cvMathG3 && mathValue <= cvMathG4) {
                    countmathGood++;
                }
                if (natureValue > cvNatureG3 && natureValue <= cvNatureG4) {
                    countnatureGood++;
                }
                if (physicalValue > cvPhysicalG3 && physicalValue <= cvPhysicalG4) {
                    countphysicalGood++;
                }
                if (informaticsValue > cvInformaticsG3 && informaticsValue <= cvInformaticsG4) {
                    countinformaticsGood++;
                }
                if (fineValue > cvFineG3 && fineValue <= cvFineG4) {
                    countfineGood++;
                }
                if (musicValue > cvMusicG3 && musicValue <= cvMusicG4) {
                    countmusicGood++;
                }
                if (athleticValue > cvAthleticG3 && athleticValue <= cvAthleticG4) {
                    countathleticGood++;
                }
                if (rateValue > cvRateG3 && rateValue <= cvRateG4) {
                    countrateGood++;
                }

                // Coefficient of Variation - G4 - 20
                if (arabicValue > cvArabicG4 && arabicValue <= 20) {
                    countarabicVeryGood++;
                }
                if (amazighValue > cvAmazighG4 && amazighValue <= 20) {
                    countamazighVeryGood++;
                }
                if (frenchValue > cvFrenchG4 && frenchValue <= 20) {
                    countfrenchVeryGood++;
                }
                if (englishValue > cvEnglishG4 && englishValue <= 20) {
                    countenglishVeryGood++;
                }
                if (islamicValue > cvIslamicG4 && islamicValue <= 20) {
                    countislamicVeryGood++;
                }
                if (civicsValue > cvCivicsG4 && civicsValue <= 20) {
                    countcivicsVeryGood++;
                }
                if (historyandgeographyValue > cvHistoryAndGeographyG4 && historyandgeographyValue <= 20) {
                    counthistoryandgeographyVeryGood++;
                }
                if (mathValue > cvMathG4 && mathValue <= 20) {
                    countmathVeryGood++;
                }
                if (natureValue > cvNatureG4 && natureValue <= 20) {
                    countnatureVeryGood++;
                }
                if (physicalValue > cvPhysicalG4 && physicalValue <= 20) {
                    countphysicalVeryGood++;
                }
                if (informaticsValue > cvInformaticsG4 && informaticsValue <= 20) {
                    countinformaticsVeryGood++;
                }
                if (fineValue > cvFineG4 && fineValue <= 20) {
                    countfineVeryGood++;
                }
                if (musicValue > cvMusicG4 && musicValue <= 20) {
                    countmusicVeryGood++;
                }
                if (athleticValue > cvAthleticG4 && athleticValue <= 20) {
                    countathleticVeryGood++;
                }
                if (rateValue > cvRateG4 && rateValue <= 20) {
                    countrateVeryGood++;
                }

                //Count the number of values greater than 1
                if (arabicValue >= 1) {
                    countarabicCV++;
                }
                if (amazighValue >= 1) {
                    countamazighCV++;
                }
                if (frenchValue >= 1) {
                    countfrenchCV++;
                }
                if (englishValue >= 1) {
                    countenglishCV++;
                }
                if (islamicValue >= 1) {
                    countislamicCV++;
                }
                if (civicsValue >= 1) {
                    countcivicsCV++;
                }
                if (historyandgeographyValue > 1) {
                    counthistoryandgeographyCV++;
                }
                if (mathValue >= 1) {
                    countmathCV++;
                }
                if (natureValue >= 1) {
                    countnatureCV++;
                }
                if (physicalValue >= 1) {
                    countphysicalCV++;
                }
                if (informaticsValue >= 1) {
                    countinformaticsCV++;
                }
                if (fineValue >= 1) {
                    countfineCV++;
                }
                if (musicValue >= 1) {
                    countmusicCV++;
                }
                if (athleticValue >= 1) {
                    countathleticCV++;
                }
                if (rateValue >= 1) {
                    countrateCV++;
                }

                return true;

            });

            let ArabicpercentageG1 = countarabicCV > 0 ? (countarabicWeak * 100) / countarabicCV :0; 
            let AmazighpercentageG1 = countamazighCV > 0 ? (countamazighWeak * 100) / countamazighCV :0;
            let FrenchpercentageG1 = countfrenchCV > 0 ? (countfrenchWeak * 100) / countfrenchCV : 0;
            let EnglishpercentageG1 = countenglishCV > 0 ? (countenglishWeak * 100) / countenglishCV : 0;
            let IslamicpercentageG1 = countislamicCV > 0 ? (countislamicWeak * 100) / countislamicCV : 0;
            let CivicspercentageG1 = countcivicsCV > 0 ? (countcivicsWeak * 100) / countcivicsCV : 0;
            let HistoryAndGeographypercentageG1 = counthistoryandgeographyCV > 0 ? (counthistoryandgeographyWeak * 100) / counthistoryandgeographyCV : 0;
            let MathpercentageG1 = countmathCV > 0 ? (countmathWeak * 100) / countmathCV : 0;
            let NaturepercentageG1 = countnatureCV > 0 ? (countnatureWeak * 100) / countnatureCV : 0;
            let PhysicalpercentageG1 = countphysicalCV > 0 ? (countphysicalWeak * 100) / countphysicalCV : 0;
            let InformaticspercentageG1 = countinformaticsCV > 0 ? (countinformaticsWeak * 100) / countinformaticsCV : 0;
            let FinepercentageG1 = countfineCV > 0 ? (countfineWeak * 100) / countfineCV : 0;
            let MusicpercentageG1 = countmusicCV > 0 ? (countmusicWeak * 100) / countmusicCV : 0;
            let AthleticpercentageG1 = countathleticCV > 0 ? (countathleticWeak * 100) / countathleticCV : 0;
            let RatepercentageG1 = countrateCV > 0 ? (countrateWeak * 100) / countrateCV : 0;

            let ArabicpercentageG2 = countarabicCV > 0 ? (countarabicCloseto * 100) / countarabicCV : 0; 
            let AmazighpercentageG2 = countamazighCV > 0 ? (countamazighCloseto * 100) / countamazighCV : 0;
            let FrenchpercentageG2 = countfrenchCV > 0 ? (countfrenchCloseto * 100) / countfrenchCV : 0;
            let EnglishpercentageG2 = countenglishCV > 0 ? (countenglishCloseto * 100) / countenglishCV : 0;
            let IslamicpercentageG2 = countislamicCV > 0 ? (countislamicCloseto * 100) / countislamicCV : 0;
            let CivicspercentageG2 = countcivicsCV > 0 ? (countcivicsCloseto * 100) / countcivicsCV : 0;
            let HistoryAndGeographypercentageG2 = counthistoryandgeographyCV > 0 ? (counthistoryandgeographyCloseto * 100) / counthistoryandgeographyCV : 0;
            let MathpercentageG2 = countmathCV > 0 ? (countmathCloseto * 100) / countmathCV : 0;
            let NaturepercentageG2 = countnatureCV > 0 ? (countnatureCloseto * 100) / countnatureCV : 0;
            let PhysicalpercentageG2 = countphysicalCV > 0 ? (countphysicalCloseto * 100) / countphysicalCV : 0;
            let InformaticspercentageG2 = countinformaticsCV > 0 ? (countinformaticsCloseto * 100) / countinformaticsCV : 0;
            let FinepercentageG2 = countfineCV > 0 ? (countfineCloseto * 100) / countfineCV : 0;
            let MusicpercentageG2 = countmusicCV > 0 ? (countmusicCloseto * 100) / countmusicCV : 0;
            let AthleticpercentageG2 = countathleticCV > 0 ? (countathleticCloseto * 100) / countathleticCV : 0;
            let RatepercentageG2 = countrateCV > 0 ? (countrateCloseto * 100) / countrateCV : 0;

            let ArabicpercentageG3 = countarabicCV > 0 ? (countarabicMedium * 100) / countarabicCV : 0; 
            let AmazighpercentageG3 = countamazighCV > 0 ? (countamazighMedium * 100) / countamazighCV : 0;
            let FrenchpercentageG3 = countfrenchCV > 0 ? (countfrenchMedium * 100) / countfrenchCV : 0;
            let EnglishpercentageG3 = countenglishCV > 0 ? (countenglishMedium * 100) / countenglishCV : 0;
            let IslamicpercentageG3 = countislamicCV > 0 ? (countislamicMedium * 100) / countislamicCV : 0;
            let CivicspercentageG3 = countcivicsCV > 0 ? (countcivicsMedium * 100) / countcivicsCV : 0;
            let HistoryAndGeographypercentageG3 = counthistoryandgeographyCV > 0 ? (counthistoryandgeographyMedium * 100) / counthistoryandgeographyCV : 0;
            let MathpercentageG3 = countmathCV > 0 ? (countmathMedium * 100) / countmathCV : 0;
            let NaturepercentageG3 = countnatureCV > 0 ? (countnatureMedium * 100) / countnatureCV : 0;
            let PhysicalpercentageG3 = countphysicalCV > 0 ? (countphysicalMedium * 100) / countphysicalCV : 0;
            let InformaticspercentageG3 = countinformaticsCV > 0 ? (countinformaticsMedium * 100) / countinformaticsCV : 0;
            let FinepercentageG3 = countfineCV > 0 ? (countfineMedium * 100) / countfineCV : 0;
            let MusicpercentageG3 = countmusicCV > 0 ? (countmusicMedium * 100) / countmusicCV : 0;
            let AthleticpercentageG3 = countathleticCV > 0 ? (countathleticMedium * 100) / countathleticCV : 0;
            let RatepercentageG3 = countrateCV > 0 ? (countrateMedium * 100) / countrateCV : 0;

            let ArabicpercentageG4 = countarabicCV > 0 ? (countarabicGood * 100) / countarabicCV : 0; 
            let AmazighpercentageG4 = countamazighCV > 0 ? (countamazighGood * 100) / countamazighCV : 0;
            let FrenchpercentageG4 = countfrenchCV > 0 ? (countfrenchGood * 100) / countfrenchCV : 0;
            let EnglishpercentageG4 = countenglishCV > 0 ? (countenglishGood * 100) / countenglishCV : 0;
            let IslamicpercentageG4 = countislamicCV > 0 ? (countislamicGood * 100) / countislamicCV : 0;
            let CivicspercentageG4 = countcivicsCV > 0 ? (countcivicsGood * 100) / countcivicsCV : 0;
            let HistoryAndGeographypercentageG4 = counthistoryandgeographyCV > 0 ? (counthistoryandgeographyGood * 100) / counthistoryandgeographyCV : 0;
            let MathpercentageG4 = countmathCV > 0 ? (countmathGood * 100) / countmathCV : 0;
            let NaturepercentageG4 = countnatureCV > 0 ? (countnatureGood * 100) / countnatureCV : 0;
            let PhysicalpercentageG4 = countphysicalCV > 0 ? (countphysicalGood * 100) / countphysicalCV : 0;
            let InformaticspercentageG4 = countinformaticsCV > 0 ? (countinformaticsGood * 100) / countinformaticsCV : 0;
            let FinepercentageG4 = countfineCV > 0 ? (countfineGood * 100) / countfineCV : 0;
            let MusicpercentageG4 = countmusicCV > 0 ? (countmusicGood * 100) / countmusicCV : 0;
            let AthleticpercentageG4 = countathleticCV > 0 ? (countathleticGood * 100) / countathleticCV : 0;
            let RatepercentageG4 = countrateCV > 0 ? (countrateGood * 100) / countrateCV : 0;

            let ArabicpercentageG5 = countarabicCV > 0 ? (countarabicVeryGood * 100) / countarabicCV : 0; 
            let AmazighpercentageG5 = countamazighCV > 0 ? (countamazighVeryGood * 100) / countamazighCV : 0;
            let FrenchpercentageG5 = countfrenchCV > 0 ? (countfrenchVeryGood * 100) / countfrenchCV : 0;
            let EnglishpercentageG5 = countenglishCV > 0 ? (countenglishVeryGood * 100) / countenglishCV : 0;
            let IslamicpercentageG5 = countislamicCV > 0 ? (countislamicVeryGood * 100) / countislamicCV : 0;
            let CivicspercentageG5 = countcivicsCV > 0 ? (countcivicsVeryGood * 100) / countcivicsCV : 0;
            let HistoryAndGeographypercentageG5 = counthistoryandgeographyCV > 0 ? (counthistoryandgeographyVeryGood * 100) / counthistoryandgeographyCV : 0;
            let MathpercentageG5 = countmathCV > 0 ? (countmathVeryGood * 100) / countmathCV : 0;
            let NaturepercentageG5 = countnatureCV > 0 ? (countnatureVeryGood * 100) / countnatureCV : 0;
            let PhysicalpercentageG5 = countphysicalCV > 0 ? (countphysicalVeryGood * 100) / countphysicalCV : 0;
            let InformaticspercentageG5 = countinformaticsCV > 0 ? (countinformaticsVeryGood * 100) / countinformaticsCV : 0;
            let FinepercentageG5 = countfineCV > 0 ? (countfineVeryGood * 100) / countfineCV : 0;
            let MusicpercentageG5 = countmusicCV > 0 ? (countmusicVeryGood * 100) / countmusicCV : 0;
            let AthleticpercentageG5 = countathleticCV > 0 ? (countathleticVeryGood * 100) / countathleticCV : 0;
            let RatepercentageG5 = countrateCV > 0 ? (countrateVeryGood * 100) / countrateCV : 0;



                $('#arabic-cv').text(cvArabic.toFixed(2) + "%");
                $('#amazigh-cv').text(cvAmazigh.toFixed(2) + "%");
                $('#french-cv').text(cvFrench.toFixed(2) + "%");
                $('#english-cv').text(cvEnglish.toFixed(2) + "%");
                $('#islamic-cv').text(cvIslamic.toFixed(2) + "%");
                $('#civics-cv').text(cvCivics.toFixed(2) + "%");
                $('#historyandgeography-cv').text(cvHistoryAndGeography.toFixed(2) + "%");
                $('#math-cv').text(cvMath.toFixed(2) + "%");
                $('#nature-cv').text(cvNature.toFixed(2) + "%");
                $('#physical-cv').text(cvPhysical.toFixed(2) + "%");
                $('#informatics-cv').text(cvInformatics.toFixed(2) + "%");
                $('#fine-cv').text(cvFine.toFixed(2) + "%");
                $('#music-cv').text(cvMusic.toFixed(2) + "%");
                $('#athletic-cv').text(cvAthletic.toFixed(2) + "%");
                $('#rate-cv').text(cvRate.toFixed(2) + "%");

                $('#arabic-percentageG1').text(ArabicpercentageG1.toFixed(2) + "%");
                $('#amazigh-percentageG1').text(AmazighpercentageG1.toFixed(2) + "%");
                $('#french-percentageG1').text(FrenchpercentageG1.toFixed(2) + "%");
                $('#english-percentageG1').text(EnglishpercentageG1.toFixed(2) + "%");
                $('#islamic-percentageG1').text(IslamicpercentageG1.toFixed(2) + "%");
                $('#civics-percentageG1').text(CivicspercentageG1.toFixed(2) + "%");
                $('#historyandgeography-percentageG1').text(HistoryAndGeographypercentageG1.toFixed(2) + "%");
                $('#math-percentageG1').text(MathpercentageG1.toFixed(2) + "%");
                $('#nature-percentageG1').text(NaturepercentageG1.toFixed(2) + "%");
                $('#physical-percentageG1').text(PhysicalpercentageG1.toFixed(2) + "%");
                $('#informatics-percentageG1').text(InformaticspercentageG1.toFixed(2) + "%");
                $('#fine-percentageG1').text(FinepercentageG1.toFixed(2) + "%");
                $('#music-percentageG1').text(MusicpercentageG1.toFixed(2) + "%");
                $('#athletic-percentageG1').text(AthleticpercentageG1.toFixed(2) + "%");
                $('#rate-percentageG1').text(RatepercentageG1.toFixed(2) + "%");

                $('#arabic-percentageG2').text(ArabicpercentageG2.toFixed(2) + "%");
                $('#amazigh-percentageG2').text(AmazighpercentageG2.toFixed(2) + "%");
                $('#french-percentageG2').text(FrenchpercentageG2.toFixed(2) + "%");
                $('#english-percentageG2').text(EnglishpercentageG2.toFixed(2) + "%");
                $('#islamic-percentageG2').text(IslamicpercentageG2.toFixed(2) + "%");
                $('#civics-percentageG2').text(CivicspercentageG2.toFixed(2) + "%");
                $('#historyandgeography-percentageG2').text(HistoryAndGeographypercentageG2.toFixed(2) + "%");
                $('#math-percentageG2').text(MathpercentageG2.toFixed(2) + "%");
                $('#nature-percentageG2').text(NaturepercentageG2.toFixed(2) + "%");
                $('#physical-percentageG2').text(PhysicalpercentageG2.toFixed(2) + "%");
                $('#informatics-percentageG2').text(InformaticspercentageG2.toFixed(2) + "%");
                $('#fine-percentageG2').text(FinepercentageG2.toFixed(2) + "%");
                $('#music-percentageG2').text(MusicpercentageG2.toFixed(2) + "%");
                $('#athletic-percentageG2').text(AthleticpercentageG2.toFixed(2) + "%");
                $('#rate-percentageG2').text(RatepercentageG2.toFixed(2) + "%");

                $('#arabic-percentageG3').text(ArabicpercentageG3.toFixed(2) + "%");
                $('#amazigh-percentageG3').text(AmazighpercentageG3.toFixed(2) + "%");
                $('#french-percentageG3').text(FrenchpercentageG3.toFixed(2) + "%");
                $('#english-percentageG3').text(EnglishpercentageG3.toFixed(2) + "%");
                $('#islamic-percentageG3').text(IslamicpercentageG3.toFixed(2) + "%");
                $('#civics-percentageG3').text(CivicspercentageG3.toFixed(2) + "%");
                $('#historyandgeography-percentageG3').text(HistoryAndGeographypercentageG3.toFixed(2) + "%");
                $('#math-percentageG3').text(MathpercentageG3.toFixed(2) + "%");
                $('#nature-percentageG3').text(NaturepercentageG3.toFixed(2) + "%");
                $('#physical-percentageG3').text(PhysicalpercentageG3.toFixed(2) + "%");
                $('#informatics-percentageG3').text(InformaticspercentageG3.toFixed(2) + "%");
                $('#fine-percentageG3').text(FinepercentageG3.toFixed(2) + "%");
                $('#music-percentageG3').text(MusicpercentageG3.toFixed(2) + "%");
                $('#athletic-percentageG3').text(AthleticpercentageG3.toFixed(2) + "%");
                $('#rate-percentageG3').text(RatepercentageG3.toFixed(2) + "%");

                $('#arabic-percentageG4').text(ArabicpercentageG4.toFixed(2) + "%");
                $('#amazigh-percentageG4').text(AmazighpercentageG4.toFixed(2) + "%");
                $('#french-percentageG4').text(FrenchpercentageG4.toFixed(2) + "%");
                $('#english-percentageG4').text(EnglishpercentageG4.toFixed(2) + "%");
                $('#islamic-percentageG4').text(IslamicpercentageG4.toFixed(2) + "%");
                $('#civics-percentageG4').text(CivicspercentageG4.toFixed(2) + "%");
                $('#historyandgeography-percentageG4').text(HistoryAndGeographypercentageG4.toFixed(2) + "%");
                $('#math-percentageG4').text(MathpercentageG4.toFixed(2) + "%");
                $('#nature-percentageG4').text(NaturepercentageG4.toFixed(2) + "%");
                $('#physical-percentageG4').text(PhysicalpercentageG4.toFixed(2) + "%");
                $('#informatics-percentageG4').text(InformaticspercentageG4.toFixed(2) + "%");
                $('#fine-percentageG4').text(FinepercentageG4.toFixed(2) + "%");
                $('#music-percentageG4').text(MusicpercentageG4.toFixed(2) + "%");
                $('#athletic-percentageG4').text(AthleticpercentageG4.toFixed(2) + "%");
                $('#rate-percentageG4').text(RatepercentageG4.toFixed(2) + "%");

                $('#arabic-percentageG5').text(ArabicpercentageG5.toFixed(2) + "%");
                $('#amazigh-percentageG5').text(AmazighpercentageG5.toFixed(2) + "%");
                $('#french-percentageG5').text(FrenchpercentageG5.toFixed(2) + "%");
                $('#english-percentageG5').text(EnglishpercentageG5.toFixed(2) + "%");
                $('#islamic-percentageG5').text(IslamicpercentageG5.toFixed(2) + "%");
                $('#civics-percentageG5').text(CivicspercentageG5.toFixed(2) + "%");
                $('#historyandgeography-percentageG5').text(HistoryAndGeographypercentageG5.toFixed(2) + "%");
                $('#math-percentageG5').text(MathpercentageG5.toFixed(2) + "%");
                $('#nature-percentageG5').text(NaturepercentageG5.toFixed(2) + "%");
                $('#physical-percentageG5').text(PhysicalpercentageG5.toFixed(2) + "%");
                $('#informatics-percentageG5').text(InformaticspercentageG5.toFixed(2) + "%");
                $('#fine-percentageG5').text(FinepercentageG5.toFixed(2) + "%");
                $('#music-percentageG5').text(MusicpercentageG5.toFixed(2) + "%");
                $('#athletic-percentageG5').text(AthleticpercentageG5.toFixed(2) + "%");
                $('#rate-percentageG5').text(RatepercentageG5.toFixed(2) + "%");

                $('#arabic-countG1').text(countarabicWeak);
                $('#amazigh-countG1').text(countamazighWeak);
                $('#french-countG1').text(countfrenchWeak);
                $('#english-countG1').text(countenglishWeak);
                $('#islamic-countG1').text(countislamicWeak);
                $('#civics-countG1').text(countcivicsWeak);
                $('#historyandgeography-countG1').text(counthistoryandgeographyWeak);
                $('#math-countG1').text(countmathWeak);
                $('#nature-countG1').text(countnatureWeak);
                $('#physical-countG1').text(countphysicalWeak);
                $('#informatics-countG1').text(countinformaticsWeak);
                $('#fine-countG1').text(countfineWeak);
                $('#music-countG1').text(countmusicWeak);
                $('#athletic-countG1').text(countathleticWeak);
                $('#rate-countG1').text(countrateWeak);

                $('#arabic-countG2').text(countarabicCloseto);
                $('#amazigh-countG2').text(countamazighCloseto);
                $('#french-countG2').text(countfrenchCloseto);
                $('#english-countG2').text(countenglishCloseto);
                $('#islamic-countG2').text(countislamicCloseto);
                $('#civics-countG2').text(countcivicsCloseto);
                $('#historyandgeography-countG2').text(counthistoryandgeographyCloseto);
                $('#math-countG2').text(countmathCloseto);
                $('#nature-countG2').text(countnatureCloseto);
                $('#physical-countG2').text(countphysicalCloseto);
                $('#informatics-countG2').text(countinformaticsCloseto);
                $('#fine-countG2').text(countfineCloseto);
                $('#music-countG2').text(countmusicCloseto);
                $('#athletic-countG2').text(countathleticCloseto);
                $('#rate-countG2').text(countrateCloseto);

                $('#arabic-countG3').text(countarabicMedium);
                $('#amazigh-countG3').text(countamazighMedium);
                $('#french-countG3').text(countfrenchMedium);
                $('#english-countG3').text(countenglishMedium);
                $('#islamic-countG3').text(countislamicMedium);
                $('#civics-countG3').text(countcivicsMedium);
                $('#historyandgeography-countG3').text(counthistoryandgeographyMedium);
                $('#math-countG3').text(countmathMedium);
                $('#nature-countG3').text(countnatureMedium);
                $('#physical-countG3').text(countphysicalMedium);
                $('#informatics-countG3').text(countinformaticsMedium);
                $('#fine-countG3').text(countfineMedium);
                $('#music-countG3').text(countmusicMedium);
                $('#athletic-countG3').text(countathleticMedium);
                $('#rate-countG3').text(countrateMedium);

                $('#arabic-countG4').text(countarabicGood);
                $('#amazigh-countG4').text(countamazighGood);
                $('#french-countG4').text(countfrenchGood);
                $('#english-countG4').text(countenglishGood);
                $('#islamic-countG4').text(countislamicGood);
                $('#civics-countG4').text(countcivicsGood);
                $('#historyandgeography-countG4').text(counthistoryandgeographyGood);
                $('#math-countG4').text(countmathGood);
                $('#nature-countG4').text(countnatureGood);
                $('#physical-countG4').text(countphysicalGood);
                $('#informatics-countG4').text(countinformaticsGood);
                $('#fine-countG4').text(countfineGood);
                $('#music-countG4').text(countmusicGood);
                $('#athletic-countG4').text(countathleticGood);
                $('#rate-countG4').text(countrateGood);

                $('#arabic-countG5').text(countarabicVeryGood);
                $('#amazigh-countG5').text(countamazighVeryGood);
                $('#french-countG5').text(countfrenchVeryGood);
                $('#english-countG5').text(countenglishVeryGood);
                $('#islamic-countG5').text(countislamicVeryGood);
                $('#civics-countG5').text(countcivicsVeryGood);
                $('#historyandgeography-countG5').text(counthistoryandgeographyVeryGood);
                $('#math-countG5').text(countmathVeryGood);
                $('#nature-countG5').text(countnatureVeryGood);
                $('#physical-countG5').text(countphysicalVeryGood);
                $('#informatics-countG5').text(countinformaticsVeryGood);
                $('#fine-countG5').text(countfineVeryGood);
                $('#music-countG5').text(countmusicVeryGood);
                $('#athletic-countG5').text(countathleticVeryGood);
                $('#rate-countG5').text(countrateVeryGood);

                if (cvArabic <= 15) {
                    $('#arabic-cvNote').text("هناك إنسجام تام");
                } else if (cvArabic <= 30 && cvArabic > 15) {
                    $('#arabic-cvNote').text("هناك إنسجام نسبي");
                } else if (cvArabic > 30 && cvArabic > 15) {
                    $('#arabic-cvNote').text("هناك تشتت واختلاف");
                } else {
                    $('#arabic-cvNote').text("-");
                }
                if (cvAmazigh <= 15) {
                    $('#amazigh-cvNote').text("هناك إنسجام تام");
                } else if (cvAmazigh <= 30 && cvAmazigh > 15) {
                    $('#amazigh-cvNote').text("هناك إنسجام نسبي");
                } else if (cvAmazigh > 30 && cvAmazigh > 15) {
                    $('#amazigh-cvNote').text("هناك تشتت واختلاف");
                } else {
                    $('#amazigh-cvNote').text("-");
                }
                if (cvFrench <= 15) {
                    $('#french-cvNote').text("هناك إنسجام تام");
                } else if (cvFrench <= 30 && cvFrench > 15) {
                    $('#french-cvNote').text("هناك إنسجام نسبي");
                } else if (cvFrench > 30 && cvFrench > 15) {
                    $('#french-cvNote').text("هناك تشتت واختلاف");
                } else {
                    $('#french-cvNote').text("-");
                }
                if (cvEnglish <= 15) {
                    $('#english-cvNote').text("هناك إنسجام تام");
                } else if (cvEnglish <= 30 && cvEnglish > 15) {
                    $('#english-cvNote').text("هناك إنسجام نسبي");
                } else if (cvEnglish > 30 && cvEnglish > 15) {
                    $('#english-cvNote').text("هناك تشتت واختلاف");
                } else {
                    $('#english-cvNote').text("-");
                }
                if (cvIslamic <= 15) {
                    $('#islamic-cvNote').text("هناك إنسجام تام");
                } else if (cvIslamic <= 30 && cvIslamic > 15) {
                    $('#islamic-cvNote').text("هناك إنسجام نسبي");
                } else if (cvIslamic > 30 && cvIslamic > 15) {
                    $('#islamic-cvNote').text("هناك تشتت واختلاف");
                } else {
                    $('#islamic-cvNote').text("-");
                }
                if (cvCivics <= 15) {
                    $('#civics-cvNote').text("هناك إنسجام تام");
                } else if (cvCivics <= 30 && cvCivics > 15) {
                    $('#civics-cvNote').text("هناك إنسجام نسبي");
                } else if (cvCivics > 30 && cvCivics > 15) {
                    $('#civics-cvNote').text("هناك تشتت واختلاف");
                } else {
                    $('#civics-cvNote').text("-");
                }
                if (cvHistoryAndGeography <= 15) {
                    $('#historyandgeography-cvNote').text("هناك إنسجام تام");
                } else if (cvHistoryAndGeography <= 30 && cvHistoryAndGeography > 15) {
                    $('#historyandgeography-cvNote').text("هناك إنسجام نسبي");
                } else if (cvHistoryAndGeography > 30 && cvHistoryAndGeography > 15) {
                    $('#historyandgeography-cvNote').text("هناك تشتت واختلاف");
                } else {
                    $('#historyandgeography-cvNote').text("-");
                }
                if (cvMath <= 15) {
                    $('#math-cvNote').text("هناك إنسجام تام");
                } else if (cvMath <= 30 && cvMath > 15) {
                    $('#math-cvNote').text("هناك إنسجام نسبي");
                } else if (cvMath > 30 && cvMath > 15) {
                    $('#math-cvNote').text("هناك تشتت واختلاف");
                } else {
                    $('#math-cvNote').text("-");
                }
                if (cvNature <= 15) {
                    $('#nature-cvNote').text("هناك إنسجام تام");
                } else if (cvNature <= 30 && cvNature > 15) {
                    $('#nature-cvNote').text("هناك إنسجام نسبي");
                } else if (cvNature > 30 && cvNature > 15) {
                    $('#nature-cvNote').text("هناك تشتت واختلاف");
                } else {
                    $('#nature-cvNote').text("-");
                }
                if (cvPhysical <= 15) {
                    $('#physical-cvNote').text("هناك إنسجام تام");
                } else if (cvPhysical <= 30 && cvPhysical > 15) {
                    $('#physical-cvNote').text("هناك إنسجام نسبي");
                } else if (cvPhysical > 30 && cvPhysical > 15) {
                    $('#physical-cvNote').text("هناك تشتت واختلاف");
                } else {
                    $('#physical-cvNote').text("-");
                }
                if (cvInformatics <= 15) {
                    $('#informatics-cvNote').text("هناك إنسجام تام");
                } else if (cvInformatics <= 30 && cvInformatics > 15) {
                    $('#informatics-cvNote').text("هناك إنسجام نسبي");
                } else if (cvInformatics > 30 && cvInformatics > 15) {
                    $('#informatics-cvNote').text("هناك تشتت واختلاف");
                } else {
                    $('#informatics-cvNote').text("-");
                }
                if (cvFine <= 15) {
                    $('#fine-cvNote').text("هناك إنسجام تام");
                } else if (cvFine <= 30 && cvFine > 15) {
                    $('#fine-cvNote').text("هناك إنسجام نسبي");
                } else if (cvFine > 30 && cvFine > 15) {
                    $('#fine-cvNote').text("هناك تشتت واختلاف");
                } else {
                    $('#fine-cvNote').text("-");
                }
                if (cvMusic <= 15) {
                    $('#music-cvNote').text("هناك إنسجام تام");
                } else if (cvMusic <= 30 && cvMusic > 15) {
                    $('#music-cvNote').text("هناك إنسجام نسبي");
                } else if (cvMusic > 30 && cvMusic > 15) {
                    $('#music-cvNote').text("هناك تشتت واختلاف");
                } else {
                    $('#music-cvNote').text("-");
                }
                if (cvAthletic <= 15) {
                    $('#athletic-cvNote').text("هناك إنسجام تام");
                } else if (cvAthletic <= 30 && cvAthletic > 15) {
                    $('#athletic-cvNote').text("هناك إنسجام نسبي");
                } else if (cvAthletic > 30 && cvAthletic > 15) {
                    $('#athletic-cvNote').text("هناك تشتت واختلاف");
                } else {
                    $('#athletic-cvNote').text("-");
                }
                if (cvRate <= 15) {
                    $('#rate-cvNote').text("هناك إنسجام تام");
                } else if (cvRate <= 30 && cvRate > 15) {
                    $('#rate-cvNote').text("هناك إنسجام نسبي");
                } else if (cvRate > 30 && cvRate > 15) {
                    $('#rate-cvNote').text("هناك تشتت واختلاف");
                } else {
                    $('#rate-cvNote').text("-");
                }

            




/////////////////////////////
//Analyse Table Area chart
/////////////////////////////
var dataAnalyse = [
    { subject: 'اللغة العربية', mean: meanArabic.toFixed(2)},
    { subject: 'اللغة اﻷمازيغية', mean: meanAmazigh.toFixed(2)},
    { subject: 'اللغة الفرنسية', mean: meanFrench.toFixed(2)},
    { subject: 'اللغة الإنجليزية', mean: meanEnglish.toFixed(2)},
    { subject: 'التربية الإسلامية', mean: meanIslamic.toFixed(2)},
    { subject: 'التربية المدنية', mean: meanCivics.toFixed(2)},
    { subject: 'التاريخ والجغرافيا', mean: meanHistoryAndGeography.toFixed(2)},
    { subject: 'الرياضيات', mean: meanMath.toFixed(2)},
    { subject: 'ع الطبيعة و الحياة', mean: meanNature.toFixed(2)},
    { subject: 'ع الفيزيائية والتكنولوجيا', mean: meanPhysical.toFixed(2)},
    { subject: 'المعلوماتية', mean: meanInformatics.toFixed(2)},
    { subject: 'التربية التشكيلية', mean: meanFine.toFixed(2)},
    { subject: 'التربية الموسيقية', mean: meanMusic.toFixed(2)},
    { subject: 'ت البدنية و الرياضية', mean: meanAthletic.toFixed(2)},
    { subject: 'معدل الفصل 2', mean: meanRate.toFixed(2)},
];

// Extract subject names and mean values
var subjectsAnalyse = dataAnalyse.map(item => item.subject);
var meansAnalyse = dataAnalyse.map(item => item.mean);

// Create Bar Chart
var traceAnalyse = {
    x: subjectsAnalyse,
    y: meansAnalyse,
    type: 'bar'
};

var layoutAnalyse = {
    title: 'رسم بياني يمثل نتائج الفصل الأول حسب المواد',
    xaxis: {
        title: 'المواد'
    },
    yaxis: {
        title: ''
    }
};
 $('#collapse1').on('shown.bs.collapse', function () {
        // Initialize the chart when the accordion item is shown
Plotly.newPlot('Analyse-chart', [traceAnalyse], layoutAnalyse, {displaylogo: false});
});

/////////////////////////////
//Greater 10 Table Area chart
/////////////////////////////
var dataGreater = [
    {
        subject: 'اللغة العربية', 
        GreaterThanTen: percentageArabicGreaterThanTen,
        BEightAndNine: percentageArabicBetweenEightAndNine,
        LessThanEight: percentageArabicLessThanEight
    },

    {
        subject: 'اللغة اﻷمازيغية', 
        GreaterThanTen: percentageAmazighGreaterThanTen,
        BEightAndNine: percentageAmazighBetweenEightAndNine,
        LessThanEight: percentageAmazighLessThanEight
        },
    {
        subject: 'اللغة الفرنسية', 
        GreaterThanTen: percentageFrenchGreaterThanTen,
        BEightAndNine: percentageFrenchBetweenEightAndNine,
        LessThanEight: percentageFrenchLessThanEight
        },
    {
        subject: 'اللغة الإنجليزية', 
        GreaterThanTen: percentageEnglishGreaterThanTen,
        BEightAndNine: percentageEnglishBetweenEightAndNine,
        LessThanEight: percentageEnglishLessThanEight
        },
    {
        subject: 'التربية الإسلامية', 
        GreaterThanTen: percentageIslamicGreaterThanTen,
        BEightAndNine: percentageIslamicBetweenEightAndNine,
        LessThanEight: percentageIslamicLessThanEight
        },
    {
        subject: 'التربية المدنية', 
        GreaterThanTen: percentageCivicsGreaterThanTen,
        BEightAndNine: percentageCivicsBetweenEightAndNine,
        LessThanEight: percentageCivicsLessThanEight
        },
    {
        subject: 'التاريخ والجغرافيا', 
        GreaterThanTen: percentageHistoryAndGeographyGreaterThanTen,
        BEightAndNine: percentageHistoryAndGeographyBetweenEightAndNine,
        LessThanEight: percentageHistoryAndGeographyLessThanEight
        },
    {
        subject: 'الرياضيات', 
        GreaterThanTen: percentageMathGreaterThanTen,
        BEightAndNine: percentageMathBetweenEightAndNine,
        LessThanEight: percentageMathLessThanEight
        },
    {
        subject: 'ع الطبيعة و الحياة', 
        GreaterThanTen: percentageNatureGreaterThanTen,
        BEightAndNine: percentageNatureBetweenEightAndNine,
        LessThanEight: percentageNatureLessThanEight
        },
    {
        subject: 'ع الفيزيائية والتكنولوجيا', 
        GreaterThanTen: percentagePhysicalGreaterThanTen,
        BEightAndNine: percentagePhysicalBetweenEightAndNine,
        LessThanEight: percentagePhysicalLessThanEight
        },
    {
        subject: 'المعلوماتية', 
        GreaterThanTen: percentageInformaticsGreaterThanTen,
        BEightAndNine: percentageInformaticsBetweenEightAndNine,
        LessThanEight: percentageInformaticsLessThanEight
        },
    {
        subject: 'التربية التشكيلية', 
        GreaterThanTen: percentageFineGreaterThanTen,
        BEightAndNine: percentageFineBetweenEightAndNine,
        LessThanEight: percentageFineLessThanEight
        },
    {
        subject: 'التربية الموسيقية', 
        GreaterThanTen: percentageMusicGreaterThanTen,
        BEightAndNine: percentageMusicBetweenEightAndNine,
        LessThanEight: percentageMusicLessThanEight
        },
    {
        subject: 'ت البدنية و الرياضية', 
        GreaterThanTen: percentageAthleticGreaterThanTen,
        BEightAndNine: percentageAthleticBetweenEightAndNine,
        LessThanEight: percentageAthleticLessThanEight
        },
    {
        subject: 'معدل الفصل 2', 
        GreaterThanTen: percentageRateGreaterThanTen,
        BEightAndNine: percentageRateBetweenEightAndNine,
        LessThanEight: percentageRateLessThanEight
        },

];

// Extract subject names and GreaterThanTen values
var subjectsGreater = dataGreater.map(item => item.subject);
var GreaterThanTen = dataGreater.map(item => item.GreaterThanTen);
var BetweenEightAndNine = dataGreater.map(item => item.BEightAndNine);
var LessThanEight = dataGreater.map(item => item.LessThanEight);

// Create Bar Chart
var traceGreaterThanTen = {
    x: subjectsGreater,
    y: GreaterThanTen,
    type: 'bar',
    name: 'أكبر أو يساوي 10'
};

var traceBEightAndNine = {
    x: subjectsGreater,
    y: BetweenEightAndNine,
    type: 'bar',
    name: 'من 08 الى 09.99'
};

var traceLessThanEight = {
    x: subjectsGreater,
    y: LessThanEight,
    type: 'bar',
    name: 'أقل من 08'
};

var tracedataGreater = [traceGreaterThanTen, traceBEightAndNine, traceLessThanEight];

var layoutGreater = {
    title: 'رسم بياني يمثل نتائج الفصل الأول حسب الفئات',
    xaxis: {
        title: 'المواد'
    },
    yaxis: {
        title: ''
    },
    legend: {
        orientation: 'h', // Horizontal orientation
        x: 0.32, // Adjust as needed
        y: -0.2 // Position below the plot area
    }
};
 $('#collapse2').on('shown.bs.collapse', function () {
        // Initialize the chart when the accordion item is shown
Plotly.newPlot('Greater-chart', tracedataGreater, layoutGreater, {displaylogo: false});
});

/////////////////////////////
//Success Rate Table Area chart
/////////////////////////////
var dataSuccessRate = [
    {
        subject: 'اللغة العربية', 
        SuccessRate: percentageArabicGreaterThanTen,
    },

    {
        subject: 'اللغة اﻷمازيغية', 
        SuccessRate: percentageAmazighGreaterThanTen,
        },
    {
        subject: 'اللغة الفرنسية', 
        SuccessRate: percentageFrenchGreaterThanTen,
        },
    {
        subject: 'اللغة الإنجليزية', 
        SuccessRate: percentageEnglishGreaterThanTen,
        },
    {
        subject: 'التربية الإسلامية', 
        SuccessRate: percentageIslamicGreaterThanTen,
        },
    {
        subject: 'التربية المدنية', 
        SuccessRate: percentageCivicsGreaterThanTen,
        },
    {
        subject: 'التاريخ والجغرافيا', 
        SuccessRate: percentageHistoryAndGeographyGreaterThanTen,
        },
    {
        subject: 'الرياضيات', 
        SuccessRate: percentageMathGreaterThanTen,
        },
    {
        subject: 'ع الطبيعة و الحياة', 
        SuccessRate: percentageNatureGreaterThanTen,
        },
    {
        subject: 'ع الفيزيائية والتكنولوجيا', 
        SuccessRate: percentagePhysicalGreaterThanTen,
        },
    {
        subject: 'المعلوماتية', 
        SuccessRate: percentageInformaticsGreaterThanTen,
        },
    {
        subject: 'التربية التشكيلية', 
        SuccessRate: percentageFineGreaterThanTen,
        },
    {
        subject: 'التربية الموسيقية', 
        SuccessRate: percentageMusicGreaterThanTen,
        },
    {
        subject: 'ت البدنية و الرياضية', 
        SuccessRate: percentageAthleticGreaterThanTen,
        },
    {
        subject: 'معدل الفصل 2', 
        SuccessRate: percentageRateGreaterThanTen,
        },

];

// Extract subject names and GreaterThanTen values
var subjectsSuccessRate = dataSuccessRate.map(item => item.subject);
var SuccessRate = dataSuccessRate.map(item => item.SuccessRate);


// Create Bar Chart
var traceSuccessRate = {
    x: subjectsSuccessRate,
    y: SuccessRate,
    type: 'bar',
    name: 'أكبر أو يساوي 10'
};

var layoutSuccessRate = {
    title: 'رسم بياني يمثل توزيع التلاميذ حسب نسبة النجاح',
    xaxis: {
        title: 'المواد'
    },
    yaxis: {
        title: ''
    },
    legend: {
        orientation: 'h', // Horizontal orientation
        x: 0.32, // Adjust as needed
        y: -0.2 // Position below the plot area
    }
};
 $('#collapse3').on('shown.bs.collapse', function () {
        // Initialize the chart when the accordion item is shown
Plotly.newPlot('SuccessRate-chart', [traceSuccessRate], layoutSuccessRate, {displaylogo: false});
});

/////////////////////////////
//Greater 10 Male Table Area chart
/////////////////////////////
var dataGreaterMale = [
    {
        subject: 'اللغة العربية',
        GreaterThanTenMale: percentageArabicGTenMale,
        BEightAndNineMale: percentageArabicBetweenEightAndNineMale,
        LessThanEightMale: percentageArabicLessThanEightMale
    },

    {
        subject: 'اللغة اﻷمازيغية', 
        GreaterThanTenMale: percentageAmazighGTenMale,
        BEightAndNineMale: percentageAmazighBetweenEightAndNineMale,
        LessThanEightMale: percentageAmazighLessThanEightMale
        },
    {
        subject: 'اللغة الفرنسية', 
        GreaterThanTenMale: percentageFrenchGTenMale,
        BEightAndNineMale: percentageFrenchBetweenEightAndNineMale,
        LessThanEightMale: percentageFrenchLessThanEightMale
        },
    {
        subject: 'اللغة الإنجليزية', 
        GreaterThanTenMale: percentageEnglishGTenMale,
        BEightAndNineMale: percentageEnglishBetweenEightAndNineMale,
        LessThanEightMale: percentageEnglishLessThanEightMale
        },
    {
        subject: 'التربية الإسلامية', 
        GreaterThanTenMale: percentageIslamicGTenMale,
        BEightAndNineMale: percentageIslamicBetweenEightAndNineMale,
        LessThanEightMale: percentageIslamicLessThanEightMale
        },
    {
        subject: 'التربية المدنية', 
        GreaterThanTenMale: percentageCivicsGTenMale,
        BEightAndNineMale: percentageCivicsBetweenEightAndNineMale,
        LessThanEightMale: percentageCivicsLessThanEightMale
        },
    {
        subject: 'التاريخ والجغرافيا', 
        GreaterThanTenMale: percentageHistoryAndGeographyGTenMale,
        BEightAndNineMale: percentageHistoryAndGeographyBetweenEightAndNineMale,
        LessThanEightMale: percentageHistoryAndGeographyLessThanEightMale
        },
    {
        subject: 'الرياضيات', 
        GreaterThanTenMale: percentageMathGTenMale,
        BEightAndNineMale: percentageMathBetweenEightAndNineMale,
        LessThanEightMale: percentageMathLessThanEightMale
        },
    {
        subject: 'ع الطبيعة و الحياة', 
        GreaterThanTenMale: percentageNatureGTenMale,
        BEightAndNineMale: percentageNatureBetweenEightAndNineMale,
        LessThanEightMale: percentageNatureLessThanEightMale
        },
    {
        subject: 'ع الفيزيائية والتكنولوجيا', 
        GreaterThanTenMale: percentagePhysicalGTenMale,
        BEightAndNineMale: percentagePhysicalBetweenEightAndNineMale,
        LessThanEightMale: percentagePhysicalLessThanEightMale
        },
    {
        subject: 'المعلوماتية', 
        GreaterThanTenMale: percentageInformaticsGTenMale,
        BEightAndNineMale: percentageInformaticsBetweenEightAndNineMale,
        LessThanEightMale: percentageInformaticsLessThanEightMale
        },
    {
        subject: 'التربية التشكيلية', 
        GreaterThanTenMale: percentageFineGTenMale,
        BEightAndNineMale: percentageFineBetweenEightAndNineMale,
        LessThanEightMale: percentageFineLessThanEightMale
        },
    {
        subject: 'التربية الموسيقية', 
        GreaterThanTenMale: percentageMusicGTenMale,
        BEightAndNineMale: percentageMusicBetweenEightAndNineMale,
        LessThanEightMale: percentageMusicLessThanEightMale
        },
    {
        subject: 'ت البدنية و الرياضية', 
        GreaterThanTenMale: percentageAthleticGTenMale,
        BEightAndNineMale: percentageAthleticBetweenEightAndNineMale,
        LessThanEightMale: percentageAthleticLessThanEightMale
        },
    {
        subject: 'معدل الفصل 2', 
        GreaterThanTenMale: percentageRateGTenMale,
        BEightAndNineMale: percentageRateBetweenEightAndNineMale,
        LessThanEightMale: percentageRateLessThanEightMale
        },

];

// Extract subject names and GreaterThanTen values
var subjectsGreaterMale = dataGreaterMale.map(item => item.subject);
var GreaterThanTenMale = dataGreaterMale.map(item => item.GreaterThanTenMale);
var BetweenEightAndNineMale = dataGreaterMale.map(item => item.BEightAndNineMale);
var LessThanEightMale = dataGreaterMale.map(item => item.LessThanEightMale);

// Create Bar Chart
var traceGreaterThanTenMale = {
    x: subjectsGreaterMale,
    y: GreaterThanTenMale,
    type: 'bar',
    name: 'أكبر أو يساوي 10'
};

var traceBEightAndNineMale = {
    x: subjectsGreaterMale,
    y: BetweenEightAndNineMale,
    type: 'bar',
    name: 'من 08 الى 09.99'
};

var traceLessThanEightMale = {
    x: subjectsGreaterMale,
    y: LessThanEightMale,
    type: 'bar',
    name: 'أقل من 08'
};

var tracedataGreaterMale = [traceGreaterThanTenMale, traceBEightAndNineMale, traceLessThanEightMale];

var layoutGreaterMale = {
    title: 'رسم بياني يمثل توزيع التلاميذ بالنسبة للفئات حسب الجنس (ذكور)',
    xaxis: {
        title: 'المواد'
    },
    yaxis: {
        title: ''
    },
    legend: {
        orientation: 'h', // Horizontal orientation
        x: 0.32, // Adjust as needed
        y: -0.2 // Position below the plot area
    }
};
 $('#collapse4').on('shown.bs.collapse', function () {
        // Initialize the chart when the accordion item is shown
Plotly.newPlot('GreaterMale-chart', tracedataGreaterMale, layoutGreaterMale, {displaylogo: false});
});

/////////////////////////////
//Greater 10 Female Table Area chart
/////////////////////////////
var dataGreaterFemale = [
    {
        subject: 'اللغة العربية', 
        GreaterThanTenFemale: percentageArabicGTenFemale,
        BEightAndNineFemale: percentageArabicBetweenEightAndNineFemale,
        LessThanEightFemale: percentageArabicLessThanEightFemale
    },

    {
        subject: 'اللغة اﻷمازيغية', 
        GreaterThanTenFemale: percentageAmazighGTenFemale,
        BEightAndNineFemale: percentageAmazighBetweenEightAndNineFemale,
        LessThanEightFemale: percentageAmazighLessThanEightFemale
        },
    {
        subject: 'اللغة الفرنسية', 
        GreaterThanTenFemale: percentageFrenchGTenFemale,
        BEightAndNineFemale: percentageFrenchBetweenEightAndNineFemale,
        LessThanEightFemale: percentageFrenchLessThanEightFemale
        },
    {
        subject: 'اللغة الإنجليزية', 
        GreaterThanTenFemale: percentageEnglishGTenFemale,
        BEightAndNineFemale: percentageEnglishBetweenEightAndNineFemale,
        LessThanEightFemale: percentageEnglishLessThanEightFemale
        },
    {
        subject: 'التربية الإسلامية', 
        GreaterThanTenFemale: percentageIslamicGTenFemale,
        BEightAndNineFemale: percentageIslamicBetweenEightAndNineFemale,
        LessThanEightFemale: percentageIslamicLessThanEightFemale
        },
    {
        subject: 'التربية المدنية', 
        GreaterThanTenFemale: percentageCivicsGTenFemale,
        BEightAndNineFemale: percentageCivicsBetweenEightAndNineFemale,
        LessThanEightFemale: percentageCivicsLessThanEightFemale
        },
    {
        subject: 'التاريخ والجغرافيا', 
        GreaterThanTenFemale: percentageHistoryAndGeographyGTenFemale,
        BEightAndNineFemale: percentageHistoryAndGeographyBetweenEightAndNineFemale,
        LessThanEightFemale: percentageHistoryAndGeographyLessThanEightFemale
        },
    {
        subject: 'الرياضيات', 
        GreaterThanTenFemale: percentageMathGTenFemale,
        BEightAndNineFemale: percentageMathBetweenEightAndNineFemale,
        LessThanEightFemale: percentageMathLessThanEightFemale
        },
    {
        subject: 'ع الطبيعة و الحياة', 
        GreaterThanTenFemale: percentageNatureGTenFemale,
        BEightAndNineFemale: percentageNatureBetweenEightAndNineFemale,
        LessThanEightFemale: percentageNatureLessThanEightFemale
        },
    {
        subject: 'ع الفيزيائية والتكنولوجيا', 
        GreaterThanTenFemale: percentagePhysicalGTenFemale,
        BEightAndNineFemale: percentagePhysicalBetweenEightAndNineFemale,
        LessThanEightFemale: percentagePhysicalLessThanEightFemale
        },
    {
        subject: 'المعلوماتية', 
        GreaterThanTenFemale: percentageInformaticsGTenFemale,
        BEightAndNineFemale: percentageInformaticsBetweenEightAndNineFemale,
        LessThanEightFemale: percentageInformaticsLessThanEightFemale
        },
    {
        subject: 'التربية التشكيلية', 
        GreaterThanTenFemale: percentageFineGTenFemale,
        BEightAndNineFemale: percentageFineBetweenEightAndNineFemale,
        LessThanEightFemale: percentageFineLessThanEightFemale
        },
    {
        subject: 'التربية الموسيقية', 
        GreaterThanTenFemale: percentageMusicGTenFemale,
        BEightAndNineFemale: percentageMusicBetweenEightAndNineFemale,
        LessThanEightFemale: percentageMusicLessThanEightFemale
        },
    {
        subject: 'ت البدنية و الرياضية', 
        GreaterThanTenFemale: percentageAthleticGTenFemale,
        BEightAndNineFemale: percentageAthleticBetweenEightAndNineFemale,
        LessThanEightFemale: percentageAthleticLessThanEightFemale
        },
    {
        subject: 'معدل الفصل 2', 
        GreaterThanTenFemale: percentageRateGTenFemale,
        BEightAndNineFemale: percentageRateBetweenEightAndNineFemale,
        LessThanEightFemale: percentageRateLessThanEightFemale
        },

];

// Extract subject names and GreaterThanTen values
var subjectsGreaterFemale = dataGreaterFemale.map(item => item.subject);
var GreaterThanTenFemale = dataGreaterFemale.map(item => item.GreaterThanTenFemale);
var BetweenEightAndNineFemale = dataGreaterFemale.map(item => item.BEightAndNineFemale);
var LessThanEightFemale = dataGreaterFemale.map(item => item.LessThanEightFemale);

// Create Bar Chart
var traceGreaterThanTenFemale = {
    x: subjectsGreaterFemale,
    y: GreaterThanTenFemale,
    type: 'bar',
    name: 'أكبر أو يساوي 10'
};

var traceBEightAndNineFemale = {
    x: subjectsGreaterFemale,
    y: BetweenEightAndNineFemale,
    type: 'bar',
    name: 'من 08 الى 09.99'
};

var traceLessThanEightFemale = {
    x: subjectsGreaterFemale,
    y: LessThanEightFemale,
    type: 'bar',
    name: 'أقل من 08'
};

var tracedataGreaterFemale = [traceGreaterThanTenFemale, traceBEightAndNineFemale, traceLessThanEightFemale];

var layoutGreaterFemale = {
    title: 'رسم بياني يمثل توزيع التلاميذ بالنسبة للفئات حسب الجنس (الإناث)',
    xaxis: {
        title: 'المواد'
    },
    yaxis: {
        title: ''
    },
    legend: {
        orientation: 'h', // Horizontal orientation
        x: 0.32, // Adjust as needed
        y: -0.2 // Position below the plot area
    }
};
 $('#collapse5').on('shown.bs.collapse', function () {
        // Initialize the chart when the accordion item is shown
Plotly.newPlot('GreaterFemale-chart', tracedataGreaterFemale, layoutGreaterFemale, {displaylogo: false});
});

/////////////////////////////
//Greater 10 Failure Table Area chart
/////////////////////////////
var dataGreaterFailure = [
    {
        subject: 'اللغة العربية', 
        GreaterThanTenFailure: percentageArabicGTenFailure,
        BEightAndNineFailure: percentageArabicBetweenEightAndNineFailure,
        LessThanEightFailure: percentageArabicLessThanEightFailure
    },

    {
        subject: 'اللغة اﻷمازيغية', 
        GreaterThanTenFailure: percentageAmazighGTenFailure,
        BEightAndNineFailure: percentageAmazighBetweenEightAndNineFailure,
        LessThanEightFailure: percentageAmazighLessThanEightFailure
        },
    {
        subject: 'اللغة الفرنسية', 
        GreaterThanTenFailure: percentageFrenchGTenFailure,
        BEightAndNineFailure: percentageFrenchBetweenEightAndNineFailure,
        LessThanEightFailure: percentageFrenchLessThanEightFailure
        },
    {
        subject: 'اللغة الإنجليزية', 
        GreaterThanTenFailure: percentageEnglishGTenFailure,
        BEightAndNineFailure: percentageEnglishBetweenEightAndNineFailure,
        LessThanEightFailure: percentageEnglishLessThanEightFailure
        },
    {
        subject: 'التربية الإسلامية', 
        GreaterThanTenFailure: percentageIslamicGTenFailure,
        BEightAndNineFailure: percentageIslamicBetweenEightAndNineFailure,
        LessThanEightFailure: percentageIslamicLessThanEightFailure
        },
    {
        subject: 'التربية المدنية', 
        GreaterThanTenFailure: percentageCivicsGTenFailure,
        BEightAndNineFailure: percentageCivicsBetweenEightAndNineFailure,
        LessThanEightFailure: percentageCivicsLessThanEightFailure
        },
    {
        subject: 'التاريخ والجغرافيا', 
        GreaterThanTenFailure: percentageHistoryAndGeographyGTenFailure,
        BEightAndNineFailure: percentageHistoryAndGeographyBetweenEightAndNineFailure,
        LessThanEightFailure: percentageHistoryAndGeographyLessThanEightFailure
        },
    {
        subject: 'الرياضيات', 
        GreaterThanTenFailure: percentageMathGTenFailure,
        BEightAndNineFailure: percentageMathBetweenEightAndNineFailure,
        LessThanEightFailure: percentageMathLessThanEightFailure
        },
    {
        subject: 'ع الطبيعة و الحياة', 
        GreaterThanTenFailure: percentageNatureGTenFailure,
        BEightAndNineFailure: percentageNatureBetweenEightAndNineFailure,
        LessThanEightFailure: percentageNatureLessThanEightFailure
        },
    {
        subject: 'ع الفيزيائية والتكنولوجيا', 
        GreaterThanTenFailure: percentagePhysicalGTenFailure,
        BEightAndNineFailure: percentagePhysicalBetweenEightAndNineFailure,
        LessThanEightFailure: percentagePhysicalLessThanEightFailure
        },
    {
        subject: 'المعلوماتية', 
        GreaterThanTenFailure: percentageInformaticsGTenFailure,
        BEightAndNineFailure: percentageInformaticsBetweenEightAndNineFailure,
        LessThanEightFailure: percentageInformaticsLessThanEightFailure
        },
    {
        subject: 'التربية التشكيلية', 
        GreaterThanTenFailure: percentageFineGTenFailure,
        BEightAndNineFailure: percentageFineBetweenEightAndNineFailure,
        LessThanEightFailure: percentageFineLessThanEightFailure
        },
    {
        subject: 'التربية الموسيقية', 
        GreaterThanTenFailure: percentageMusicGTenFailure,
        BEightAndNineFailure: percentageMusicBetweenEightAndNineFailure,
        LessThanEightFailure: percentageMusicLessThanEightFailure
        },
    {
        subject: 'ت البدنية و الرياضية', 
        GreaterThanTenFailure: percentageAthleticGTenFailure,
        BEightAndNineFailure: percentageAthleticBetweenEightAndNineFailure,
        LessThanEightFailure: percentageAthleticLessThanEightFailure
        },
    {
        subject: 'معدل الفصل 2', 
        GreaterThanTenFailure: percentageRateGTenFailure,
        BEightAndNineFailure: percentageRateBetweenEightAndNineFailure,
        LessThanEightFailure: percentageRateLessThanEightFailure
        },

];

// Extract subject names and GreaterThanTen values
var subjectsGreaterFailure = dataGreaterFailure.map(item => item.subject);
var GreaterThanTenFailure = dataGreaterFailure.map(item => item.GreaterThanTenFailure);
var BetweenEightAndNineFailure = dataGreaterFailure.map(item => item.BEightAndNineFailure);
var LessThanEightFailure = dataGreaterFailure.map(item => item.LessThanEightFailure);

// Create Bar Chart
var traceGreaterThanTenFailure = {
    x: subjectsGreaterFailure,
    y: GreaterThanTenFailure,
    type: 'bar',
    name: 'أكبر أو يساوي 10'
};

var traceBEightAndNineFailure = {
    x: subjectsGreaterFailure,
    y: BetweenEightAndNineFailure,
    type: 'bar',
    name: 'من 08 الى 09.99'
};

var traceLessThanEightFailure = {
    x: subjectsGreaterFailure,
    y: LessThanEightFailure,
    type: 'bar',
    name: 'أقل من 08'
};

var tracedataGreaterFailure = [traceGreaterThanTenFailure, traceBEightAndNineFailure, traceLessThanEightFailure];

var layoutGreaterFailure = {
    title: 'رسم بياني يمثل توزيع التلاميذ بالنسبة للفئات حسب الإعادة (المعيدين)',
    xaxis: {
        title: 'المواد'
    },
    yaxis: {
        title: ''
    },
    legend: {
        orientation: 'h', // Horizontal orientation
        x: 0.32, // Adjust as needed
        y: -0.2 // Position below the plot area
    }
};
 $('#collapse6').on('shown.bs.collapse', function () {
        // Initialize the chart when the accordion item is shown
Plotly.newPlot('GreaterFailure-chart', tracedataGreaterFailure, layoutGreaterFailure, {displaylogo: false});
});

/////////////////////////////
//Greater 10 Successful Table Area chart
/////////////////////////////
var dataGreaterSuccessful = [
    {
        subject: 'اللغة العربية', 
        GreaterThanTenSuccessful: percentageArabicGTenSuccessful,
        BEightAndNineSuccessful: percentageArabicBetweenEightAndNineSuccessful,
        LessThanEightSuccessful: percentageArabicLessThanEightSuccessful
    },

    {
        subject: 'اللغة اﻷمازيغية', 
        GreaterThanTenSuccessful: percentageAmazighGTenSuccessful,
        BEightAndNineSuccessful: percentageAmazighBetweenEightAndNineSuccessful,
        LessThanEightSuccessful: percentageAmazighLessThanEightSuccessful
        },
    {
        subject: 'اللغة الفرنسية', 
        GreaterThanTenSuccessful: percentageFrenchGTenSuccessful,
        BEightAndNineSuccessful: percentageFrenchBetweenEightAndNineSuccessful,
        LessThanEightSuccessful: percentageFrenchLessThanEightSuccessful
        },
    {
        subject: 'اللغة الإنجليزية', 
        GreaterThanTenSuccessful: percentageEnglishGTenSuccessful,
        BEightAndNineSuccessful: percentageEnglishBetweenEightAndNineSuccessful,
        LessThanEightSuccessful: percentageEnglishLessThanEightSuccessful
        },
    {
        subject: 'التربية الإسلامية', 
        GreaterThanTenSuccessful: percentageIslamicGTenSuccessful,
        BEightAndNineSuccessful: percentageIslamicBetweenEightAndNineSuccessful,
        LessThanEightSuccessful: percentageIslamicLessThanEightSuccessful
        },
    {
        subject: 'التربية المدنية', 
        GreaterThanTenSuccessful: percentageCivicsGTenSuccessful,
        BEightAndNineSuccessful: percentageCivicsBetweenEightAndNineSuccessful,
        LessThanEightSuccessful: percentageCivicsLessThanEightSuccessful
        },
    {
        subject: 'التاريخ والجغرافيا', 
        GreaterThanTenSuccessful: percentageHistoryAndGeographyGTenSuccessful,
        BEightAndNineSuccessful:  percentageHistoryAndGeographyBetweenEightAndNineSuccessful,
        LessThanEightSuccessful:  percentageHistoryAndGeographyLessThanEightSuccessful
        },
    {
        subject: 'الرياضيات', 
        GreaterThanTenSuccessful: percentageMathGTenSuccessful,
        BEightAndNineSuccessful: percentageMathBetweenEightAndNineSuccessful,
        LessThanEightSuccessful: percentageMathLessThanEightSuccessful
        },
    {
        subject: 'ع الطبيعة و الحياة', 
        GreaterThanTenSuccessful: percentageNatureGTenSuccessful,
        BEightAndNineSuccessful: percentageNatureBetweenEightAndNineSuccessful,
        LessThanEightSuccessful: percentageNatureLessThanEightSuccessful
        },
    {
        subject: 'ع الفيزيائية والتكنولوجيا', 
        GreaterThanTenSuccessful: percentagePhysicalGTenSuccessful,
        BEightAndNineSuccessful: percentagePhysicalBetweenEightAndNineSuccessful,
        LessThanEightSuccessful: percentagePhysicalLessThanEightSuccessful
        },
    {
        subject: 'المعلوماتية', 
        GreaterThanTenSuccessful: percentageInformaticsGTenSuccessful,
        BEightAndNineSuccessful: percentageInformaticsBetweenEightAndNineSuccessful,
        LessThanEightSuccessful: percentageInformaticsLessThanEightSuccessful
        },
    {
        subject: 'التربية التشكيلية', 
        GreaterThanTenSuccessful: percentageFineGTenSuccessful,
        BEightAndNineSuccessful: percentageFineBetweenEightAndNineSuccessful,
        LessThanEightSuccessful: percentageFineLessThanEightSuccessful
        },
    {
        subject: 'التربية الموسيقية', 
        GreaterThanTenSuccessful: percentageMusicGTenSuccessful,
        BEightAndNineSuccessful: percentageMusicBetweenEightAndNineSuccessful,
        LessThanEightSuccessful: percentageMusicLessThanEightSuccessful
        },
    {
        subject: 'ت البدنية و الرياضية', 
        GreaterThanTenSuccessful: percentageAthleticGTenSuccessful,
        BEightAndNineSuccessful: percentageAthleticBetweenEightAndNineSuccessful,
        LessThanEightSuccessful: percentageAthleticLessThanEightSuccessful
        },
    {
        subject: 'معدل الفصل 2', 
        GreaterThanTenSuccessful: percentageRateGTenSuccessful,
        BEightAndNineSuccessful: percentageRateBetweenEightAndNineSuccessful,
        LessThanEightSuccessful: percentageRateLessThanEightSuccessful
        },

];

// Extract subject names and GreaterThanTen values
var subjectsGreaterSuccessful = dataGreaterSuccessful.map(item => item.subject);
var GreaterThanTenSuccessful = dataGreaterSuccessful.map(item => item.GreaterThanTenSuccessful);
var BetweenEightAndNineSuccessful = dataGreaterSuccessful.map(item => item.BEightAndNineSuccessful);
var LessThanEightSuccessful = dataGreaterSuccessful.map(item => item.LessThanEightSuccessful);

// Create Bar Chart
var traceGreaterThanTenSuccessful = {
    x: subjectsGreaterSuccessful,
    y: GreaterThanTenSuccessful,
    type: 'bar',
    name: 'أكبر أو يساوي 10'
};

var traceBEightAndNineSuccessful = {
    x: subjectsGreaterSuccessful,
    y: BetweenEightAndNineSuccessful,
    type: 'bar',
    name: 'من 08 الى 09.99'
};

var traceLessThanEightSuccessful = {
    x: subjectsGreaterSuccessful,
    y: LessThanEightSuccessful,
    type: 'bar',
    name: 'أقل من 08'
};

var tracedataGreaterSuccessful = [traceGreaterThanTenSuccessful, traceBEightAndNineSuccessful, traceLessThanEightSuccessful];

var layoutGreaterSuccessful = {
    title: 'رسم بياني يمثل توزيع التلاميذ بالنسبة للفئات حسب الإعادة (غير المعيدين)',
    xaxis: {
        title: 'المواد'
    },
    yaxis: {
        title: ''
    },
    legend: {
        orientation: 'h', // Horizontal orientation
        x: 0.32, // Adjust as needed
        y: -0.2 // Position below the plot area
    }
};
 $('#collapse7').on('shown.bs.collapse', function () {
        // Initialize the chart when the accordion item is shown
Plotly.newPlot('GreaterSuccessful-chart', tracedataGreaterSuccessful, layoutGreaterSuccessful, {displaylogo: false});
});

 /////////////////////////////
//Pairedsimplettest Table Area chart
/////////////////////////////
var dataPairedsimplettest = [
    {
        subject: 'اللغة العربية', 
        valuetracePairedsimplettestT1: percentageArabicGreaterThanTenT1,
        valuetracePairedsimplettestT2: percentageArabicGreaterThanTen
    },

    {
        subject: 'اللغة اﻷمازيغية', 
        valuetracePairedsimplettestT1: percentageAmazighGreaterThanTenT1,
        valuetracePairedsimplettestT2: percentageAmazighGreaterThanTen
        },
    {
        subject: 'اللغة الفرنسية', 
        valuetracePairedsimplettestT1: percentageFrenchGreaterThanTenT1,
        valuetracePairedsimplettestT2: percentageFrenchGreaterThanTen
        },
    {
        subject: 'اللغة الإنجليزية', 
        valuetracePairedsimplettestT1: percentageEnglishGreaterThanTenT1,
        valuetracePairedsimplettestT2: percentageEnglishGreaterThanTen
        },
    {
        subject: 'التربية الإسلامية', 
        valuetracePairedsimplettestT1: percentageIslamicGreaterThanTenT1,
        valuetracePairedsimplettestT2: percentageIslamicGreaterThanTen
        },
    {
        subject: 'التربية المدنية', 
        valuetracePairedsimplettestT1: percentageCivicsGreaterThanTenT1,
        valuetracePairedsimplettestT2: percentageCivicsGreaterThanTen
        },
    {
        subject: 'التاريخ والجغرافيا', 
        valuetracePairedsimplettestT1: percentageHistoryAndGeographyGreaterThanTenT1,
        valuetracePairedsimplettestT2:  percentageHistoryAndGeographyGreaterThanTen
        },
    {
        subject: 'الرياضيات', 
        valuetracePairedsimplettestT1: percentageMathGreaterThanTenT1,
        valuetracePairedsimplettestT2: percentageMathGreaterThanTen
        },
    {
        subject: 'ع الطبيعة و الحياة', 
        valuetracePairedsimplettestT1: percentageNatureGreaterThanTenT1,
        valuetracePairedsimplettestT2: percentageNatureGreaterThanTen
        },
    {
        subject: 'ع الفيزيائية والتكنولوجيا', 
        valuetracePairedsimplettestT1: percentagePhysicalGreaterThanTenT1,
        valuetracePairedsimplettestT2: percentagePhysicalGreaterThanTen
        },
    {
        subject: 'المعلوماتية', 
        valuetracePairedsimplettestT1: percentageInformaticsGreaterThanTenT1,
        valuetracePairedsimplettestT2: percentageInformaticsGreaterThanTen
        },
    {
        subject: 'التربية التشكيلية', 
        valuetracePairedsimplettestT1: percentageFineGreaterThanTenT1,
        valuetracePairedsimplettestT2: percentageFineGreaterThanTen
        },
    {
        subject: 'التربية الموسيقية', 
        valuetracePairedsimplettestT1: percentageMusicGreaterThanTenT1,
        valuetracePairedsimplettestT2: percentageMusicGreaterThanTen
        },
    {
        subject: 'ت البدنية و الرياضية', 
        valuetracePairedsimplettestT1: percentageAthleticGreaterThanTenT1,
        valuetracePairedsimplettestT2: percentageAthleticGreaterThanTen
        },
    {
        subject: 'معدل الفصل 2', 
        valuetracePairedsimplettestT1: percentageRateGreaterThanTenT1,
        valuetracePairedsimplettestT2: percentageRateGreaterThanTen
        },

];

// Extract subject names and GreaterThanTen values
var subjectsPairedsimplettest = dataPairedsimplettest.map(item => item.subject);
var valuetracePairedsimplettestT1 = dataPairedsimplettest.map(item => item.valuetracePairedsimplettestT1);
var valuetracePairedsimplettestT2 = dataPairedsimplettest.map(item => item.valuetracePairedsimplettestT2);

// Create Bar Chart
var tracePairedsimplettestT1 = {
    x: subjectsPairedsimplettest,
    y: valuetracePairedsimplettestT1,
    type: 'bar',
    name: 'أكبر أو يساوي 10'
};

var tracePairedsimplettestT2 = {
    x: subjectsPairedsimplettest,
    y: valuetracePairedsimplettestT2,
    type: 'bar',
    name: 'من 08 الى 09.99'
};


var subjectsPairedsimplettest = [tracePairedsimplettestT1, tracePairedsimplettestT2];

var layoutPairedsimplettest = {
    title: 'رسم بياني يمثل توزيع التلاميذ بالنسبة للفئات حسب الإعادة (غير المعيدين)',
    xaxis: {
        title: 'المواد'
    },
    yaxis: {
        title: ''
    },
    legend: {
        orientation: 'h', // Horizontal orientation
        x: 0.32, // Adjust as needed
        y: -0.2 // Position below the plot area
    }
};
 $('#collapse8').on('shown.bs.collapse', function () {
        // Initialize the chart when the accordion item is shown
Plotly.newPlot('Pairedsimplettest-chart', subjectsPairedsimplettest, layoutPairedsimplettest, {displaylogo: false});
});
 
}

// Attach an event listener to the button
$('#calculate-button').on('click', function() {
    // Call the function to perform the calculation when the button is clicked
    performCalculation();
});



       }

});