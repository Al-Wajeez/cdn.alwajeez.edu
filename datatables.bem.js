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
         

                    const columnsToImport = ['اللقب و الإسم', 'تاريخ الميلاد', 'المعدل السنوي', 'معدل ش ت م','معدل الإنتقال', 'رياضيات', 'رياضيات ش ت م', 'العربية', 'العربية ش ت م', 'الفرنسية', 'الفرنسية ش ت م', 'الإنجليزية', 'الإنجليزية ش ت م', 'الأمازيغية', 'الأمازيغية ش ت م', 'ت إسلامية', 'ت إسلامية ش ت م', 'ت مدنية', 'ت مدنية ش ت م', 'تاريخ جغرافيا', 'تاريخ جغرافيا ش ت م', 'علوم ط', 'علوم ط ش ت م', 'فيزياء', 'فيزياء ش ت م', 'معلوماتية', 'معلوماتية ش ت م', 'ت تشكيلية', 'ت تشكيلية ش ت م', 'ت موسيقية', 'ت موسيقية ش ت م', 'ت بدنية', 'ت بدنية ش ت م'];

                    const json_data = XLSX.utils.sheet_to_json(worksheet, { range: 1, header: 1, raw: false, dateNF: 'dd/mm/yyyy', defval: null, blankrows: false, dateNF: 'dd/mm/yyyy', header: columnsToImport });

                    // Remove the last row from json_data
                    //json_data.pop();

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

                    targets: 33,
                    render: function(data, type, row, meta) {
                        var higherlevelrat = parseFloat(row['معدل الإنتقال']) || 0;
                        var PS = '-';
                        if (higherlevelrat >= 10) {
                            PS = 'ينتقل';
                        } else if (higherlevelrat < 10) {
                            PS = 'يعيد السنة';
                        } else {
                            PS = '-';
                        }
                        return PS;

                    }

                },
                {
                    targets: [1, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
                    visible: false
                },
                {
                    targets: '_all',
                    className: 'dt-body-center'
                }
            ],
            //order: [[53, "asc"]],
            columns: [
                { data: 'اللقب و الإسم' },
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
                { data: 'المعدل السنوي' },
                { data: 'معدل ش ت م' },
                { data: 'معدل الإنتقال' },
                { data: 'رياضيات' },
                { data: 'رياضيات ش ت م' },
                { data: 'العربية' },
                { data: 'العربية ش ت م' },
                { data: 'الفرنسية' },
                { data: 'الفرنسية ش ت م' },
                { data: 'الإنجليزية' },
                { data: 'الإنجليزية ش ت م' },
                { data: 'الأمازيغية' },
                { data: 'الأمازيغية ش ت م' },
                { data: 'ت إسلامية' },
                { data: 'ت إسلامية ش ت م' },
                { data: 'ت مدنية' },
                { data: 'ت مدنية ش ت م' },
                { data: 'تاريخ جغرافيا' },
                { data: 'تاريخ جغرافيا ش ت م' },
                { data: 'علوم ط' },
                { data: 'علوم ط ش ت م' },
                { data: 'فيزياء' },
                { data: 'فيزياء ش ت م' },
                { data: 'معلوماتية' },
                { data: 'معلوماتية ش ت م' },
                { data: 'ت تشكيلية' },
                { data: 'ت تشكيلية ش ت م' },
                { data: 'ت موسيقية' },
                { data: 'ت موسيقية ش ت م' },
                { data: 'ت بدنية' },
                { data: 'ت بدنية ش ت م' },
                { data: null },
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
        let countratebemGreaterThanOne = 0;
        let countrateupGreaterThanOne = 0;

        table.rows().every(function() {
            const rowData = this.data();
            const arabicValue = parseFloat(rowData['العربية ش ت م']) || 0;
            const amazighValue = parseFloat(rowData['الأمازيغية ش ت م']) || 0;
            const frenchValue = parseFloat(rowData['الفرنسية ش ت م']) || 0;
            const englishValue = parseFloat(rowData['الإنجليزية ش ت م']) || 0;
            const islamicValue = parseFloat(rowData['ت إسلامية ش ت م']) || 0;
            const civicsValue = parseFloat(rowData['ت مدنية ش ت م']) || 0;
            const historyandgeographyValue = parseFloat(rowData['تاريخ جغرافيا ش ت م']) || 0;
            const mathValue = parseFloat(rowData['رياضيات ش ت م']) || 0;
            const natureValue = parseFloat(rowData['علوم ط ش ت م']) || 0;
            const physicalValue = parseFloat(rowData['فيزياء ش ت م']) || 0;
            const informaticsValue = parseFloat(rowData['معلوماتية ش ت م']) || 0;
            const fineValue = parseFloat(rowData['ت تشكيلية ش ت م']) || 0;
            const musicValue = parseFloat(rowData['ت موسيقية ش ت م']) || 0;
            const athleticValue = parseFloat(rowData['ت بدنية ش ت م']) || 0;
            const rateValue = parseFloat(rowData['المعدل السنوي']) || 0;
            const ratebemValue = parseFloat(rowData['معدل ش ت م']) || 0;
            const rateupValue = parseFloat(rowData['معدل الإنتقال']) || 0;

            if (arabicValue > 0) {
                countarabicGreaterThanOne++;
            }
            if (amazighValue > 0) {
                countamazighGreaterThanOne++;
            }
            if (frenchValue > 0) {
                countfrenchGreaterThanOne++;
            }
            if (englishValue > 0) {
                countenglishGreaterThanOne++;
            }
            if (islamicValue > 0) {
                countislamicGreaterThanOne++;
            }
            if (civicsValue > 0) {
                countcivicsGreaterThanOne++;
            }
            if (historyandgeographyValue > 0) {
                counthistoryandgeographyGreaterThanOne++;
            }
            if (mathValue > 0) {
                countmathGreaterThanOne++;
            }
            if (natureValue > 0) {
                countnatureGreaterThanOne++;
            }
            if (physicalValue > 0) {
                countphysicalGreaterThanOne++;
            }
            if (informaticsValue > 0) {
                countinformaticsGreaterThanOne++;
            }
            if (fineValue > 0) {
                countfineGreaterThanOne++;
            }
            if (musicValue > 0) {
                countmusicGreaterThanOne++;
            }
            if (athleticValue > 0) {
                countathleticGreaterThanOne++;
            }
            if (rateValue > 0) {
                countrateGreaterThanOne++;
            }
            if (ratebemValue > 0) {
                countratebemGreaterThanOne++;
            }
            if (rateupValue > 0) {
                countrateupGreaterThanOne++;
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
            $('#ratebem-count').text(countratebemGreaterThanOne);
            $('#rateup-count').text(countrateupGreaterThanOne);

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
            let sumRatebem = 0;
            let sumRateup = 0;

            // Count the total number of rows
            let totalRows = table.rows().count();

            // Iterate over each row to sum up the values for each subject
            table.rows().every(function() {
                const rowData = this.data();

                sumArabic += parseFloat(rowData['العربية ش ت م']) || 0;
                sumAmazigh += parseFloat(rowData['الأمازيغية ش ت م']) || 0;
                sumFrench += parseFloat(rowData['الفرنسية ش ت م']) || 0;
                sumEnglish += parseFloat(rowData['الإنجليزية ش ت م']) || 0;
                sumIslamic += parseFloat(rowData['ت إسلامية ش ت م']) || 0;
                sumCivics += parseFloat(rowData['ت مدنية ش ت م']) || 0;
                sumHistoryAndGeography += parseFloat(rowData['تاريخ جغرافيا ش ت م']) || 0;
                sumMath += parseFloat(rowData['رياضيات ش ت م']) || 0;
                sumNature += parseFloat(rowData['علوم ط ش ت م']) || 0;
                sumPhysical += parseFloat(rowData['فيزياء ش ت م']) || 0;
                sumInformatics += parseFloat(rowData['معلوماتية ش ت م']) || 0;
                sumFine += parseFloat(rowData['ت تشكيلية ش ت م']) || 0;
                sumMusic += parseFloat(rowData['ت موسيقية ش ت م']) || 0;
                sumAthletic += parseFloat(rowData['ت بدنية ش ت م']) || 0;
                sumRate += parseFloat(rowData['المعدل السنوي']) || 0;
                sumRatebem += parseFloat(rowData['معدل ش ت م']) || 0;
                sumRateup += parseFloat(rowData['معدل الإنتقال']) || 0;

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
            let meanRatebem = sumRatebem / totalRows;
            let meanRateup = sumRateup / totalRows;

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
            $('#ratebem-mean, #ratebem-meanDiff').text(meanRatebem.toFixed(2));
            $('#rateup-mean, #rateup-meanDiff').text(meanRateup.toFixed(2));

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
            addBadge('#ratebem-mean', meanRatebem);
            addBadge('#rateup-mean', meanRateup);

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
            let sumSquaredDiffRatebem = 0;
            let sumSquaredDiffRateup = 0;

            // Iterate over each row to sum up the squared differences for each subject
            table.rows().every(function() {
                const rowData = this.data();

                const arabicValue = parseFloat(rowData['العربية ش ت م']) || 0;
                const amazighValue = parseFloat(rowData['الأمازيغية ش ت م']) || 0;
                const frenchValue = parseFloat(rowData['الفرنسية ش ت م']) || 0;
                const englishValue = parseFloat(rowData['الإنجليزية ش ت م']) || 0;
                const islamicValue = parseFloat(rowData['ت إسلامية ش ت م']) || 0;
                const civicsValue = parseFloat(rowData['ت مدنية ش ت م']) || 0;
                const historyandgeographyValue = parseFloat(rowData['تاريخ جغرافيا ش ت م']) || 0;
                const mathValue = parseFloat(rowData['رياضيات ش ت م']) || 0;
                const natureValue = parseFloat(rowData['علوم ط ش ت م']) || 0;
                const physicalValue = parseFloat(rowData['فيزياء ش ت م']) || 0;
                const informaticsValue = parseFloat(rowData['معلوماتية ش ت م']) || 0;
                const fineValue = parseFloat(rowData['ت تشكيلية ش ت م']) || 0;
                const musicValue = parseFloat(rowData['ت موسيقية ش ت م']) || 0;
                const athleticValue = parseFloat(rowData['ت بدنية ش ت م']) || 0;
                const rateValue = parseFloat(rowData['المعدل السنوي']) || 0;
                const ratebemValue = parseFloat(rowData['معدل ش ت م']) || 0;
                const rateupValue = parseFloat(rowData['معدل الإنتقال']) || 0;

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
                sumSquaredDiffRatebem += Math.pow(ratebemValue - meanRatebem, 2);
                sumSquaredDiffRateup += Math.pow(rateupValue - meanRateup, 2);

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
            let meanSquaredDiffRatebem = sumSquaredDiffRatebem /  (totalRows - 1);
            let meanSquaredDiffRateup = sumSquaredDiffRateup /  (totalRows - 1);

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
            let stdvRatebem = Math.sqrt(meanSquaredDiffRatebem);
            let stdvRateup = Math.sqrt(meanSquaredDiffRateup);

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
            $('#ratebem-stdv').text(stdvRatebem.toFixed(2));
            $('#rateup-stdv').text(stdvRateup.toFixed(2));

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
            let countratebemGreaterThanTen = 0;
            let countrateupGreaterThanTen = 0;


            table.rows().every(function() {
                const rowData = this.data();

                // Calculate the total number of rows
                const totalRows = table.rows().count();

                const arabicValue = parseFloat(rowData['العربية ش ت م']) || 0;
                const amazighValue = parseFloat(rowData['الأمازيغية ش ت م']) || 0;
                const frenchValue = parseFloat(rowData['الفرنسية ش ت م']) || 0;
                const englishValue = parseFloat(rowData['الإنجليزية ش ت م']) || 0;
                const islamicValue = parseFloat(rowData['ت إسلامية ش ت م']) || 0;
                const civicsValue = parseFloat(rowData['ت مدنية ش ت م']) || 0;
                const historyandgeographyValue = parseFloat(rowData['تاريخ جغرافيا ش ت م']) || 0;
                const mathValue = parseFloat(rowData['رياضيات ش ت م']) || 0;
                const natureValue = parseFloat(rowData['علوم ط ش ت م']) || 0;
                const physicalValue = parseFloat(rowData['فيزياء ش ت م']) || 0;
                const informaticsValue = parseFloat(rowData['معلوماتية ش ت م']) || 0;
                const fineValue = parseFloat(rowData['ت تشكيلية ش ت م']) || 0;
                const musicValue = parseFloat(rowData['ت موسيقية ش ت م']) || 0;
                const athleticValue = parseFloat(rowData['ت بدنية ش ت م']) || 0;
                const rateValue = parseFloat(rowData['المعدل السنوي']) || 0;
                const ratebemValue = parseFloat(rowData['معدل ش ت م']) || 0;
                const rateupValue = parseFloat(rowData['معدل الإنتقال']) || 0;

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
                if (ratebemValue >= 10) {
                    countratebemGreaterThanTen++;
                } 
                if (rateupValue >= 10) {
                    countrateupGreaterThanTen++;
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
                const percentageRatebemGreaterThanTen = (countratebemGreaterThanTen / totalRows) * 100;
                const percentageRateupGreaterThanTen = (countrateupGreaterThanTen / totalRows) * 100;

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
                if (percentageRatebemGreaterThanTen >= 50) {
                    $('#ratebem-Note, #ratebem-NoteSucces').text("مقبول");
                } else if (percentageRatebemGreaterThanTen > 1 && percentageRatebemGreaterThanTen <= 49.99) {
                    $('#ratebem-Note, #ratebem-NoteSucces').text("للمعالجة");
                } else {
                    $('#ratebem-Note, #ratebem-NoteSucces').text("-");
                }
                if (percentageRateupGreaterThanTen >= 50) {
                    $('#rateup-Note, #rateup-NoteSucces').text("مقبول");
                } else if (percentageRateupGreaterThanTen > 1 && percentageRateupGreaterThanTen <= 49.99) {
                    $('#rateup-Note, #rateup-NoteSucces').text("للمعالجة");
                } else {
                    $('#rateup-Note, #rateup-NoteSucces').text("-");
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
                $('#ratebem-countGTen, #ratebem-countGTenSucces, #ratebem-countGTenDiff').text(countratebemGreaterThanTen);
                $('#rateup-countGTen, #rateup-countGTenSucces, #rateup-countGTenDiff').text(countrateupGreaterThanTen);

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
                $('#ratebem-percentageGTen, #ratebem-percentageGTenSucces, #ratebem-percentageGTenDiff').text(percentageRatebemGreaterThanTen.toFixed(2) + "%");
                $('#rateup-percentageGTen, #rateup-percentageGTenSucces, #rateup-percentageGTenDiff').text(percentageRateupGreaterThanTen.toFixed(2) + "%");


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
                addBadgepercentageGTen('#ratebem-percentageGTen, #ratebem-percentageGTenSucces', percentageRatebemGreaterThanTen);
                addBadgepercentageGTen('#rateup-percentageGTen, #rateup-percentageGTenSucces', percentageRateupGreaterThanTen);

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
            let countratebemBetweenEightAndNine = 0;
            let countrateupBetweenEightAndNine = 0;

            table.rows().every(function() {
                const rowData = this.data();

                // Calculate the total number of rows
                const totalRows = table.rows().count();

                const arabicValue = parseFloat(rowData['العربية ش ت م']) || 0;
                const amazighValue = parseFloat(rowData['الأمازيغية ش ت م']) || 0;
                const frenchValue = parseFloat(rowData['الفرنسية ش ت م']) || 0;
                const englishValue = parseFloat(rowData['الإنجليزية ش ت م']) || 0;
                const islamicValue = parseFloat(rowData['ت إسلامية ش ت م']) || 0;
                const civicsValue = parseFloat(rowData['ت مدنية ش ت م']) || 0;
                const historyandgeographyValue = parseFloat(rowData['تاريخ جغرافيا ش ت م']) || 0;
                const mathValue = parseFloat(rowData['رياضيات ش ت م']) || 0;
                const natureValue = parseFloat(rowData['علوم ط ش ت م']) || 0;
                const physicalValue = parseFloat(rowData['فيزياء ش ت م']) || 0;
                const informaticsValue = parseFloat(rowData['معلوماتية ش ت م']) || 0;
                const fineValue = parseFloat(rowData['ت تشكيلية ش ت م']) || 0;
                const musicValue = parseFloat(rowData['ت موسيقية ش ت م']) || 0;
                const athleticValue = parseFloat(rowData['ت بدنية ش ت م']) || 0;
                const rateValue = parseFloat(rowData['المعدل السنوي']) || 0;
                const ratebemValue = parseFloat(rowData['معدل ش ت م']) || 0;
                const rateupValue = parseFloat(rowData['معدل الإنتقال']) || 0;

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
                if (ratebemValue >= 8 && ratebemValue <= 9.99) {
                    countratebemBetweenEightAndNine++;
                } 
                if (rateupValue >= 8 && rateupValue <= 9.99) {
                    countrateupBetweenEightAndNine++;
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
                const percentageRatebemBetweenEightAndNine = (countratebemBetweenEightAndNine / totalRows) * 100;
                const percentageRateupBetweenEightAndNine = (countrateupBetweenEightAndNine / totalRows) * 100;

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
                $('#ratebem-countBEightAndNine').text(countratebemBetweenEightAndNine);
                $('#rateup-countBEightAndNine').text(countrateupBetweenEightAndNine);

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
                $('#ratebem-percentageBEightAndNine').text(percentageRatebemBetweenEightAndNine.toFixed(2) + "%");
                $('#rateup-percentageBEightAndNine').text(percentageRateupBetweenEightAndNine.toFixed(2) + "%");

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
            let countratebemLessThanEight = 0;
            let countrateupLessThanEight = 0;

            table.rows().every(function() {
                const rowData = this.data();

                // Calculate the total number of rows
                const totalRows = table.rows().count();

                const arabicValue = parseFloat(rowData['العربية ش ت م']) || 0;
                const amazighValue = parseFloat(rowData['الأمازيغية ش ت م']) || 0;
                const frenchValue = parseFloat(rowData['الفرنسية ش ت م']) || 0;
                const englishValue = parseFloat(rowData['الإنجليزية ش ت م']) || 0;
                const islamicValue = parseFloat(rowData['ت إسلامية ش ت م']) || 0;
                const civicsValue = parseFloat(rowData['ت مدنية ش ت م']) || 0;
                const historyandgeographyValue = parseFloat(rowData['تاريخ جغرافيا ش ت م']) || 0;
                const mathValue = parseFloat(rowData['رياضيات ش ت م']) || 0;
                const natureValue = parseFloat(rowData['علوم ط ش ت م']) || 0;
                const physicalValue = parseFloat(rowData['فيزياء ش ت م']) || 0;
                const informaticsValue = parseFloat(rowData['معلوماتية ش ت م']) || 0;
                const fineValue = parseFloat(rowData['ت تشكيلية ش ت م']) || 0;
                const musicValue = parseFloat(rowData['ت موسيقية ش ت م']) || 0;
                const athleticValue = parseFloat(rowData['ت بدنية ش ت م']) || 0;
                const rateValue = parseFloat(rowData['المعدل السنوي']) || 0;
                const ratebemValue = parseFloat(rowData['معدل ش ت م']) || 0;
                const rateupValue = parseFloat(rowData['معدل الإنتقال']) || 0;

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
                if (ratebemValue >0 && ratebemValue < 8) {
                    countratebemLessThanEight++;
                } 
                if (rateupValue >0 && rateupValue < 8) {
                    countrateupLessThanEight++;
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
                const percentageRatebemLessThanEight = (countratebemLessThanEight / totalRows) * 100;
                const percentageRateupLessThanEight = (countrateupLessThanEight / totalRows) * 100;

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
                $('#ratebem-countLEight').text(countratebemLessThanEight);
                $('#rateup-countLEight').text(countrateupLessThanEight);

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
                $('#ratebem-percentageLEight').text(percentageRatebemLessThanEight.toFixed(2) + "%");
                $('#rateup-percentageLEight').text(percentageRateupLessThanEight.toFixed(2) + "%");

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
                let countRatebemZeroToEight = 0;
                let countRateupZeroToEight = 0;
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
                let countRatebemNineToNinePointNine = 0;
                let countRateupNineToNinePointNine = 0;
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
                let countRatebemTenToElevenPointNine = 0;
                let countRateupTenToElevenPointNine = 0;
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
                let countRatebemTwelveToThirteenPointNine = 0;
                let countRateupTwelveToThirteenPointNine = 0;
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
                let countRatebemFourteenToFifteenPointNine = 0;
                let countRateupFourteenToFifteenPointNine = 0;
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
                let countRatebemSixteenToSeventeenPointNine = 0;
                let countRateupSixteenToSeventeenPointNine = 0;
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
                let countRatebemEighteenToTwenty = 0;
                let countRateupEighteenToTwenty = 0;


                // Iterate over each row in the table
                table.rows().every(function () {
                    const rowData = this.data();

                    const arabicValue = parseFloat(rowData['العربية ش ت م']) || 0;
                    const amazighValue = parseFloat(rowData['الأمازيغية ش ت م']) || 0;
                    const frenchValue = parseFloat(rowData['الفرنسية ش ت م']) || 0;
                    const englishValue = parseFloat(rowData['الإنجليزية ش ت م']) || 0;
                    const islamicValue = parseFloat(rowData['ت إسلامية ش ت م']) || 0;
                    const civicsValue = parseFloat(rowData['ت مدنية ش ت م']) || 0;
                    const historyGeographyValue = parseFloat(rowData['تاريخ جغرافيا ش ت م']) || 0;
                    const mathValue = parseFloat(rowData['رياضيات ش ت م']) || 0;
                    const natureValue = parseFloat(rowData['علوم ط ش ت م']) || 0;
                    const physicalValue = parseFloat(rowData['فيزياء ش ت م']) || 0;
                    const informaticsValue = parseFloat(rowData['معلوماتية ش ت م']) || 0;
                    const fineValue = parseFloat(rowData['ت تشكيلية ش ت م']) || 0;
                    const musicValue = parseFloat(rowData['ت موسيقية ش ت م']) || 0;
                    const athleticValue = parseFloat(rowData['ت بدنية ش ت م']) || 0;
                    const rateValue = parseFloat(rowData['المعدل السنوي']) || 0;
                    const ratebemValue = parseFloat(rowData['معدل ش ت م']) || 0;
                    const rateupValue = parseFloat(rowData['معدل الإنتقال']) || 0;

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
                    if (ratebemValue >= 1 && ratebemValue <=8.99) {
                        countRatebemZeroToEight++;
                    }
                    if (rateupValue >= 1 && rateupValue <=8.99) {
                        countRateupZeroToEight++;
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
                    if (ratebemValue >= 9 && ratebemValue <=9.99) {
                        countRatebemNineToNinePointNine++;
                    }
                    if (rateupValue >= 9 && rateupValue <=9.99) {
                        countRateupNineToNinePointNine++;
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
                    if (ratebemValue >= 10 && ratebemValue <= 11.99) {
                        countRatebemTenToElevenPointNine++;
                    }
                    if (rateupValue >= 10 && rateupValue <= 11.99) {
                        countRateupTenToElevenPointNine++;
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
                    if (ratebemValue >= 12 && ratebemValue <= 13.99) {
                        countRatebemTwelveToThirteenPointNine++;
                    }
                    if (rateupValue >= 12 && rateupValue <= 13.99) {
                        countRateupTwelveToThirteenPointNine++;
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
                    if (ratebemValue >= 14 && ratebemValue <= 15.99) {
                        countRatebemFourteenToFifteenPointNine++;
                    }
                    if (rateupValue >= 14 && rateupValue <= 15.99) {
                        countRateupFourteenToFifteenPointNine++;
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
                    if (ratebemValue >= 16 && ratebemValue <= 17.99) {
                        countRatebemSixteenToSeventeenPointNine++;
                    }
                    if (rateupValue >= 16 && rateupValue <= 17.99) {
                        countRateupSixteenToSeventeenPointNine++;
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
                    if (ratebemValue >= 18 && ratebemValue <= 20) {
                        countRatebemEighteenToTwenty++;
                    }
                    if (rateupValue >= 18 && rateupValue <= 20) {
                        countRateupEighteenToTwenty++;
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
                const percentageRatebemZeroToEight = (countRatebemZeroToEight / table.rows().count()) * 100;
                const percentageRateupZeroToEight = (countRateupZeroToEight / table.rows().count()) * 100;

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
                const percentageRatebemNineToNinePointNine = (countRatebemNineToNinePointNine / table.rows().count()) * 100;
                const percentageRateupNineToNinePointNine = (countRateupNineToNinePointNine / table.rows().count()) * 100;

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
                const percentageRatebemTenToElevenPointNine = (countRatebemTenToElevenPointNine / table.rows().count()) * 100;
                const percentageRateupTenToElevenPointNine = (countRateupTenToElevenPointNine / table.rows().count()) * 100;

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
                const percentageRatebemTwelveToThirteenPointNine = (countRatebemTwelveToThirteenPointNine / table.rows().count()) * 100;
                const percentageRateupTwelveToThirteenPointNine = (countRateupTwelveToThirteenPointNine / table.rows().count()) * 100;

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
                const percentageRatebemFourteenToFifteenPointNine = (countRatebemFourteenToFifteenPointNine / table.rows().count()) * 100;
                const percentageRateupFourteenToFifteenPointNine = (countRateupFourteenToFifteenPointNine / table.rows().count()) * 100;

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
                const percentageRatebemSixteenToSeventeenPointNine = (countRatebemSixteenToSeventeenPointNine / table.rows().count()) * 100;
                const percentageRateupSixteenToSeventeenPointNine = (countRateupSixteenToSeventeenPointNine / table.rows().count()) * 100;

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
                const percentageRatebemEighteenToTwenty = (countRatebemEighteenToTwenty / table.rows().count()) * 100;
                const percentageRateupEighteenToTwenty = (countRateupEighteenToTwenty / table.rows().count()) * 100;


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
                $('#ratebem-countZeroToEight').text(countRatebemZeroToEight);
                $('#rateup-countZeroToEight').text(countRateupZeroToEight);

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
                $('#ratebem-countNineToNinePointNine').text(countRatebemNineToNinePointNine);
                $('#rateup-countNineToNinePointNine').text(countRateupNineToNinePointNine);

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
                $('#ratebem-countTenToElevenPointNine').text(countRatebemTenToElevenPointNine);
                $('#rateup-countTenToElevenPointNine').text(countRateupTenToElevenPointNine);

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
                $('#ratebem-countTwelveToThirteenPointNine').text(countRatebemTwelveToThirteenPointNine);
                $('#rateup-countTwelveToThirteenPointNine').text(countRateupTwelveToThirteenPointNine);

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
                $('#ratebem-countFourteenToFifteenPointNine').text(countRatebemFourteenToFifteenPointNine);
                $('#rateup-countFourteenToFifteenPointNine').text(countRateupFourteenToFifteenPointNine);

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
                $('#ratebem-countSixteenToSeventeenPointNine').text(countRatebemSixteenToSeventeenPointNine);
                $('#rateup-countSixteenToSeventeenPointNine').text(countRateupSixteenToSeventeenPointNine);

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
                $('#ratebem-countEighteenToTwenty').text(countRatebemEighteenToTwenty);
                $('#rateup-countEighteenToTwenty').text(countRateupEighteenToTwenty);

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
                $('#ratebem-percentageZeroToEight').text(percentageRatebemZeroToEight.toFixed(2) + "%");
                $('#rateup-percentageZeroToEight').text(percentageRateupZeroToEight.toFixed(2) + "%");

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
                $('#ratebem-percentageNineToNinePointNine').text(percentageRatebemNineToNinePointNine.toFixed(2) + "%");
                $('#rateup-percentageNineToNinePointNine').text(percentageRateupNineToNinePointNine.toFixed(2) + "%");

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
                $('#ratebem-percentageTenToElevenPointNine').text(percentageRatebemTenToElevenPointNine.toFixed(2) + "%");
                $('#rateup-percentageTenToElevenPointNine').text(percentageRateupTenToElevenPointNine.toFixed(2) + "%");

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
                $('#ratebem-percentageTwelveToThirteenPointNine').text(percentageRatebemTwelveToThirteenPointNine.toFixed(2) + "%");
                $('#rateup-percentageTwelveToThirteenPointNine').text(percentageRateupTwelveToThirteenPointNine.toFixed(2) + "%");

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
                $('#ratebem-percentageFourteenToFifteenPointNine').text(percentageRatebemFourteenToFifteenPointNine.toFixed(2) + "%");
                $('#rateup-percentageFourteenToFifteenPointNine').text(percentageRateupFourteenToFifteenPointNine.toFixed(2) + "%");

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
                $('#ratebem-percentageSixteenToSeventeenPointNine').text(percentageRatebemSixteenToSeventeenPointNine.toFixed(2) + "%");
                $('#rateup-percentageSixteenToSeventeenPointNine').text(percentageRateupSixteenToSeventeenPointNine.toFixed(2) + "%");

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
                $('#ratebem-percentageEighteenToTwenty').text(percentageRatebemEighteenToTwenty.toFixed(2) + "%");
                $('#rateup-percentageEighteenToTwenty').text(percentageRateupEighteenToTwenty.toFixed(2) + "%");


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

                    const rateValue = parseFloat(rowData['معدل الإنتقال']) || 0;

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

                // Calculate the total count
                    const totalCount = table.rows().count();

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



                // diffrance between Annual and bem
                // Initialize variables to hold the sum of values for each subject

                let sumArabicAnnual = 0;
                let sumAmazighAnnual = 0;
                let sumFrenchAnnual = 0;
                let sumEnglishAnnual = 0;
                let sumIslamicAnnual = 0;
                let sumCivicsAnnual = 0;
                let sumHistoryAndGeographyAnnual = 0;
                let sumMathAnnual = 0;
                let sumNatureAnnual = 0;
                let sumPhysicalAnnual = 0;
                let sumInformaticsAnnual = 0;
                let sumFineAnnual = 0;
                let sumMusicAnnual = 0;
                let sumAthleticAnnual = 0;
                let sumRateAnnual = 0;

                // Iterate over each row to sum up the values for each subject
                table.rows().every(function() {
                    const rowData = this.data();

                    // Count the total number of rows
                    let totalRows = table.rows().count();

                    sumArabicAnnual += parseFloat(rowData['العربية']) || 0;
                    sumAmazighAnnual += parseFloat(rowData['الأمازيغية']) || 0;
                    sumFrenchAnnual += parseFloat(rowData['الفرنسية']) || 0;
                    sumEnglishAnnual += parseFloat(rowData['الإنجليزية']) || 0;
                    sumIslamicAnnual += parseFloat(rowData['ت إسلامية']) || 0;
                    sumCivicsAnnual += parseFloat(rowData['ت مدنية']) || 0;
                    sumHistoryAndGeographyAnnual += parseFloat(rowData['تاريخ جغرافيا']) || 0;
                    sumMathAnnual += parseFloat(rowData['رياضيات']) || 0;
                    sumNatureAnnual += parseFloat(rowData['علوم ط']) || 0;
                    sumPhysicalAnnual += parseFloat(rowData['فيزياء']) || 0;
                    sumInformaticsAnnual += parseFloat(rowData['معلوماتية']) || 0;
                    sumFineAnnual += parseFloat(rowData['ت تشكيلية']) || 0;
                    sumMusicAnnual += parseFloat(rowData['ت موسيقية']) || 0;
                    sumAthleticAnnual += parseFloat(rowData['ت بدنية']) || 0;
                    sumRateAnnual += parseFloat(rowData['المعدل السنوي']) || 0;
                });

                // Calculate the mean (average) for each subject
                let meanArabicAnnual = sumArabicAnnual / totalRows;
                let meanAmazighAnnual = sumAmazighAnnual / totalRows;
                let meanFrenchAnnual = sumFrenchAnnual / totalRows;
                let meanEnglishAnnual = sumEnglishAnnual / totalRows;
                let meanIslamicAnnual = sumIslamicAnnual / totalRows;
                let meanCivicsAnnual = sumCivicsAnnual / totalRows;
                let meanHistoryAndGeographyAnnual = sumHistoryAndGeographyAnnual / totalRows;
                let meanMathAnnual = sumMathAnnual / totalRows;
                let meanNatureAnnual = sumNatureAnnual / totalRows;
                let meanPhysicalAnnual = sumPhysicalAnnual / totalRows;
                let meanInformaticsAnnual = sumInformaticsAnnual / totalRows;
                let meanFineAnnual = sumFineAnnual / totalRows;
                let meanMusicAnnual = sumMusicAnnual / totalRows;
                let meanAthleticAnnual = sumAthleticAnnual / totalRows;
                let meanRateAnnual = sumRateAnnual / totalRows;

                // Update the content of the <td> elements with the means
                $('#arabic-meanAnnualDiff').text(meanArabicAnnual.toFixed(2));
                $('#amazigh-meanAnnualDiff').text(meanAmazighAnnual.toFixed(2));
                $('#french-meanAnnualDiff').text(meanFrenchAnnual.toFixed(2));
                $('#english-meanAnnualDiff').text(meanEnglishAnnual.toFixed(2));
                $('#islamic-meanAnnualDiff').text(meanIslamicAnnual.toFixed(2));
                $('#civics-meanAnnualDiff').text(meanCivicsAnnual.toFixed(2));
                $('#historyandgeography-meanAnnualDiff').text(meanHistoryAndGeographyAnnual.toFixed(2));
                $('#math-meanAnnualDiff').text(meanMathAnnual.toFixed(2));
                $('#nature-meanAnnualDiff').text(meanNatureAnnual.toFixed(2));
                $('#physical-meanAnnualDiff').text(meanPhysicalAnnual.toFixed(2));
                $('#informatics-meanAnnualDiff').text(meanInformaticsAnnual.toFixed(2));
                $('#fine-meanAnnualDiff').text(meanFineAnnual.toFixed(2));
                $('#music-meanAnnualDiff').text(meanMusicAnnual.toFixed(2));
                $('#athletic-meanAnnualDiff').text(meanAthleticAnnual.toFixed(2));
                $('#rate-meanAnnualDiff').text(meanRateAnnual.toFixed(2));

                // Count the number of values greater than 1 in 'اللغة العربية' and 'اللغة اﻷمازيغية'
                let countarabicGreaterThanTenAnnual = 0;
                let countamazighGreaterThanTenAnnual = 0;
                let countfrenchGreaterThanTenAnnual = 0;
                let countenglishGreaterThanTenAnnual = 0;
                let countislamicGreaterThanTenAnnual = 0;
                let countcivicsGreaterThanTenAnnual = 0;
                let counthistoryandgeographyGreaterThanTenAnnual = 0;
                let countmathGreaterThanTenAnnual = 0;
                let countnatureGreaterThanTenAnnual = 0;
                let countphysicalGreaterThanTenAnnual = 0;
                let countinformaticsGreaterThanTenAnnual = 0;
                let countfineGreaterThanTenAnnual = 0;
                let countmusicGreaterThanTenAnnual = 0;
                let countathleticGreaterThanTenAnnual = 0;
                let countrateGreaterThanTenAnnual = 0;

                table.rows().every(function() {
                    const rowData = this.data();

                    // Calculate the total number of rows
                    const totalRows = table.rows().count();

                    const arabicValue = parseFloat(rowData['العربية']) || 0;
                    const amazighValue = parseFloat(rowData['الأمازيغية']) || 0;
                    const frenchValue = parseFloat(rowData['الفرنسية']) || 0;
                    const englishValue = parseFloat(rowData['الإنجليزية']) || 0;
                    const islamicValue = parseFloat(rowData['ت إسلامية']) || 0;
                    const civicsValue = parseFloat(rowData['ت مدنية']) || 0;
                    const historyandgeographyValue = parseFloat(rowData['تاريخ جغرافيا']) || 0;
                    const mathValue = parseFloat(rowData['رياضيات']) || 0;
                    const natureValue = parseFloat(rowData['علوم ط']) || 0;
                    const physicalValue = parseFloat(rowData['فيزياء']) || 0;
                    const informaticsValue = parseFloat(rowData['معلوماتية']) || 0;
                    const fineValue = parseFloat(rowData['ت تشكيلية']) || 0;
                    const musicValue = parseFloat(rowData['ت موسيقية']) || 0;
                    const athleticValue = parseFloat(rowData['ت بدنية']) || 0;
                    const rateValue = parseFloat(rowData['المعدل السنوي']) || 0;

                    if (arabicValue >= 10) {
                        countarabicGreaterThanTenAnnual++;
                    }
                    if (amazighValue >= 10) {
                        countamazighGreaterThanTenAnnual++;
                    }
                    if (frenchValue >= 10) {
                        countfrenchGreaterThanTenAnnual++;
                    }
                    if (englishValue >= 10) {
                        countenglishGreaterThanTenAnnual++;
                    }
                    if (islamicValue >= 10) {
                        countislamicGreaterThanTenAnnual++;
                    }
                    if (civicsValue >= 10) {
                        countcivicsGreaterThanTenAnnual++;
                    }
                    if (historyandgeographyValue >= 10) {
                        counthistoryandgeographyGreaterThanTenAnnual++;
                    }
                    if (mathValue >= 10) {
                        countmathGreaterThanTenAnnual++;
                    }
                    if (natureValue >= 10) {
                        countnatureGreaterThanTenAnnual++;
                    }
                    if (physicalValue >= 10) {
                        countphysicalGreaterThanTenAnnual++;
                    }
                    if (informaticsValue >= 10) {
                        countinformaticsGreaterThanTenAnnual++;
                    }
                    if (fineValue >= 10) {
                        countfineGreaterThanTenAnnual++;
                    }
                    if (musicValue >= 10) {
                        countmusicGreaterThanTenAnnual++;
                    }
                    if (athleticValue >= 10) {
                        countathleticGreaterThanTenAnnual++;
                    }
                    if (rateValue >= 10) {
                        countrateGreaterThanTenAnnual++;
                    }        

                    return true;

                });

                    // Calculate the percentage of values greater than or equal to 10 for each subject
                    const percentageArabicGreaterThanTenAnnual = (countarabicGreaterThanTenAnnual / totalRows) * 100;
                    const percentageAmazighGreaterThanTenAnnual = (countamazighGreaterThanTenAnnual / totalRows) * 100;
                    const percentageFrenchGreaterThanTenAnnual = (countfrenchGreaterThanTenAnnual / totalRows) * 100;
                    const percentageEnglishGreaterThanTenAnnual = (countenglishGreaterThanTenAnnual / totalRows) * 100;
                    const percentageIslamicGreaterThanTenAnnual = (countislamicGreaterThanTenAnnual / totalRows) * 100;
                    const percentageCivicsGreaterThanTenAnnual = (countcivicsGreaterThanTenAnnual / totalRows) * 100;
                    const percentageHistoryAndGeographyGreaterThanTenAnnual = (counthistoryandgeographyGreaterThanTenAnnual / totalRows) * 100;
                    const percentageMathGreaterThanTenAnnual = (countmathGreaterThanTenAnnual / totalRows) * 100;
                    const percentageNatureGreaterThanTenAnnual = (countnatureGreaterThanTenAnnual / totalRows) * 100;
                    const percentagePhysicalGreaterThanTenAnnual = (countphysicalGreaterThanTenAnnual / totalRows) * 100;
                    const percentageInformaticsGreaterThanTenAnnual = (countinformaticsGreaterThanTenAnnual / totalRows) * 100;
                    const percentageFineGreaterThanTenAnnual = (countfineGreaterThanTenAnnual / totalRows) * 100;
                    const percentageMusicGreaterThanTenAnnual = (countmusicGreaterThanTenAnnual / totalRows) * 100;
                    const percentageAthleticGreaterThanTenAnnual = (countathleticGreaterThanTenAnnual / totalRows) * 100;
                    const percentageRateGreaterThanTenAnnual = (countrateGreaterThanTenAnnual / totalRows) * 100;

                    // Update the content of the HTML elements with the counts and percentages
                    $('#arabic-countGTenAnnualDiff').text(countarabicGreaterThanTenAnnual);
                    $('#amazigh-countGTenAnnualDiff').text(countamazighGreaterThanTenAnnual);
                    $('#french-countGTenAnnualDiff').text(countfrenchGreaterThanTenAnnual);
                    $('#english-countGTenAnnualDiff').text(countenglishGreaterThanTenAnnual);
                    $('#islamic-countGTenAnnualDiff').text(countislamicGreaterThanTenAnnual);
                    $('#civics-countGTenAnnualDiff').text(countcivicsGreaterThanTenAnnual);
                    $('#historyandgeography-countGTenAnnualDiff').text(counthistoryandgeographyGreaterThanTenAnnual);
                    $('#math-countGTenAnnualDiff').text(countmathGreaterThanTenAnnual);
                    $('#nature-countGTenAnnualDiff').text(countnatureGreaterThanTenAnnual);
                    $('#physical-countGTenAnnualDiff').text(countphysicalGreaterThanTenAnnual);
                    $('#informatics-countGTenAnnualDiff').text(countinformaticsGreaterThanTenAnnual);
                    $('#fine-countGTenAnnualDiff').text(countfineGreaterThanTenAnnual);
                    $('#music-countGTenAnnualDiff').text(countmusicGreaterThanTenAnnual);
                    $('#athletic-countGTenAnnualDiff').text(countathleticGreaterThanTenAnnual);
                    $('#rate-countGTenAnnualDiff').text(countrateGreaterThanTenAnnual);

                    // Update the content of the HTML elements with the counts and percentages
                    $('#arabic-percentageGTenAnnualDiff').text(percentageArabicGreaterThanTenAnnual.toFixed(2) + "%");
                    $('#amazigh-percentageGTenAnnualDiff').text(percentageAmazighGreaterThanTenAnnual.toFixed(2) + "%");
                    $('#french-percentageGTenAnnualDiff').text(percentageFrenchGreaterThanTenAnnual.toFixed(2) + "%");
                    $('#english-percentageGTenAnnualDiff').text(percentageEnglishGreaterThanTenAnnual.toFixed(2) + "%");
                    $('#islamic-percentageGTenAnnualDiff').text(percentageIslamicGreaterThanTenAnnual.toFixed(2) + "%");
                    $('#civics-percentageGTenAnnualDiff').text(percentageCivicsGreaterThanTenAnnual.toFixed(2) + "%");
                    $('#historyandgeography-percentageGTenAnnualDiff').text(percentageHistoryAndGeographyGreaterThanTenAnnual.toFixed(2) + "%");
                    $('#math-percentageGTenAnnualDiff').text(percentageMathGreaterThanTenAnnual.toFixed(2) + "%");
                    $('#nature-percentageGTenAnnualDiff').text(percentageNatureGreaterThanTenAnnual.toFixed(2) + "%");
                    $('#physical-percentageGTenAnnualDiff').text(percentagePhysicalGreaterThanTenAnnual.toFixed(2) + "%");
                    $('#informatics-percentageGTenAnnualDiff').text(percentageInformaticsGreaterThanTenAnnual.toFixed(2) + "%");
                    $('#fine-percentageGTenAnnualDiff').text(percentageFineGreaterThanTenAnnual.toFixed(2) + "%");
                    $('#music-percentageGTenAnnualDiff').text(percentageMusicGreaterThanTenAnnual.toFixed(2) + "%");
                    $('#athletic-percentageGTenAnnualDiff').text(percentageAthleticGreaterThanTenAnnual.toFixed(2) + "%");
                    $('#rate-percentageGTenAnnualDiff').text(percentageRateGreaterThanTenAnnual.toFixed(2) + "%");

                    //Average spreads
                    const percentageArabicAnnualbem = Math.abs(percentageArabicGreaterThanTen - percentageArabicGreaterThanTenAnnual);
                    const percentageAmazighAnnualbem = Math.abs(percentageAmazighGreaterThanTen - percentageAmazighGreaterThanTenAnnual);
                    const percentageFrenchAnnualbem = Math.abs(percentageFrenchGreaterThanTen - percentageFrenchGreaterThanTenAnnual);
                    const percentageEnglishAnnualbem = Math.abs(percentageEnglishGreaterThanTen - percentageEnglishGreaterThanTenAnnual);
                    const percentageIslamicAnnualbem = Math.abs(percentageIslamicGreaterThanTen - percentageIslamicGreaterThanTenAnnual);
                    const percentageCivicsAnnualbem = Math.abs(percentageCivicsGreaterThanTen - percentageCivicsGreaterThanTenAnnual);
                    const percentageHistoryAndGeographyAnnualbem = Math.abs(percentageHistoryAndGeographyGreaterThanTen - percentageHistoryAndGeographyGreaterThanTenAnnual);
                    const percentageMathAnnualbem = Math.abs(percentageMathGreaterThanTen - percentageMathGreaterThanTenAnnual);
                    const percentageNatureAnnualbem = Math.abs(percentageNatureGreaterThanTen - percentageNatureGreaterThanTenAnnual);
                    const percentagePhysicalAnnualbem = Math.abs(percentagePhysicalGreaterThanTen - percentagePhysicalGreaterThanTenAnnual);
                    const percentageInformaticsAnnualbem = Math.abs(percentageInformaticsGreaterThanTen - percentageInformaticsGreaterThanTenAnnual);
                    const percentageFineAnnualbem = Math.abs(percentageFineGreaterThanTen - percentageFineGreaterThanTenAnnual);
                    const percentageMusicAnnualbem = Math.abs(percentageMusicGreaterThanTen - percentageMusicGreaterThanTenAnnual);
                    const percentageAthleticAnnualbem = Math.abs(percentageAthleticGreaterThanTen - percentageAthleticGreaterThanTenAnnual);
                    const percentageRateAnnualbem = Math.abs(percentageRatebemGreaterThanTen - percentageRateGreaterThanTenAnnual); 

                    // Update the content of the HTML elements with the counts and percentages
                    $('#arabic-percentageGTenAnnualbemDiff').text(percentageArabicAnnualbem.toFixed(2) + "%");
                    $('#amazigh-percentageGTenAnnualbemDiff').text(percentageAmazighAnnualbem.toFixed(2) + "%");
                    $('#french-percentageGTenAnnualbemDiff').text(percentageFrenchAnnualbem.toFixed(2) + "%");
                    $('#english-percentageGTenAnnualbemDiff').text(percentageEnglishAnnualbem.toFixed(2) + "%");
                    $('#islamic-percentageGTenAnnualbemDiff').text(percentageIslamicAnnualbem.toFixed(2) + "%");
                    $('#civics-percentageGTenAnnualbemDiff').text(percentageCivicsAnnualbem.toFixed(2) + "%");
                    $('#historyandgeography-percentageGTenAnnualbemDiff').text(percentageHistoryAndGeographyAnnualbem.toFixed(2) + "%");
                    $('#math-percentageGTenAnnualbemDiff').text(percentageMathAnnualbem.toFixed(2) + "%");
                    $('#nature-percentageGTenAnnualbemDiff').text(percentageNatureAnnualbem.toFixed(2) + "%");
                    $('#physical-percentageGTenAnnualbemDiff').text(percentagePhysicalAnnualbem.toFixed(2) + "%");
                    $('#informatics-percentageGTenAnnualbemDiff').text(percentageInformaticsAnnualbem.toFixed(2) + "%");
                    $('#fine-percentageGTenAnnualbemDiff').text(percentageFineAnnualbem.toFixed(2) + "%");
                    $('#music-percentageGTenAnnualbemDiff').text(percentageMusicAnnualbem.toFixed(2) + "%");
                    $('#athletic-percentageGTenAnnualbemDiff').text(percentageAthleticAnnualbem.toFixed(2) + "%");
                    $('#rate-percentageGTenAnnualbemDiff').text(percentageRateAnnualbem.toFixed(2) + "%");

                    // paired simple t test
                    // Import the ttest function from simple-statistics
                    // Initialize arrays to store Arabic scores for each period

                    const arabicScoresAnnual = [];
                    const amazighScoresAnnual = [];
                    const frenchScoresAnnual = [];
                    const englishScoresAnnual = [];
                    const islamicScoresAnnual = [];
                    const civicsScoresAnnual = [];
                    const historyandgeographyScoresAnnual = [];
                    const mathScoresAnnual = [];
                    const natureScoresAnnual = [];
                    const physicalScoresAnnual = [];
                    const informaticsScoresAnnual = [];
                    const fineScoresAnnual = [];
                    const musicScoresAnnual = [];
                    const athleticScoresAnnual = [];
                    const rateScoresAnnual = [];

                    const arabicScoresbem = [];
                    const amazighScoresbem = [];
                    const frenchScoresbem = [];
                    const englishScoresbem = [];
                    const islamicScoresbem = [];
                    const civicsScoresbem = [];
                    const historyandgeographyScoresbem = [];
                    const mathScoresbem = [];
                    const natureScoresbem = [];
                    const physicalScoresbem = [];
                    const informaticsScoresbem = [];
                    const fineScoresbem = [];
                    const musicScoresbem = [];
                    const athleticScoresbem = [];
                    const rateScoresbem = [];

                    // Iterate over each row of the table
                    table.rows().every(function() {
                        const rowData = this.data();

                        // Extract Arabic score for period 1
                        const arabicValueAnnual = parseFloat(rowData['العربية']) || 0;
                        const amazighValueAnnual = parseFloat(rowData['الأمازيغية']) || 0;
                        const frenchValueAnnual = parseFloat(rowData['الفرنسية']) || 0;
                        const englishValueAnnual = parseFloat(rowData['الإنجليزية']) || 0;
                        const islamicValueAnnual = parseFloat(rowData['ت إسلامية']) || 0;
                        const civicsValueAnnual = parseFloat(rowData['ت مدنية']) || 0;
                        const historyandgeographyValueAnnual = parseFloat(rowData['تاريخ جغرافيا']) || 0;
                        const mathValueAnnual = parseFloat(rowData['رياضيات']) || 0;
                        const natureValueAnnual = parseFloat(rowData['علوم ط']) || 0;
                        const physicalValueAnnual = parseFloat(rowData['فيزياء']) || 0;
                        const informaticsValueAnnual = parseFloat(rowData['معلوماتية']) || 0;
                        const fineValueAnnual = parseFloat(rowData['ت تشكيلية']) || 0;
                        const musicValueAnnual = parseFloat(rowData['ت موسيقية']) || 0;
                        const athleticValueAnnual = parseFloat(rowData['ت بدنية']) || 0;
                        const rateValueAnnual = parseFloat(rowData['المعدل السنوي']) || 0;

                        // Extract Arabic score for period 2
                        const arabicValuebem = parseFloat(rowData['العربية ش ت م']) || 0;
                        const amazighValuebem = parseFloat(rowData['الأمازيغية ش ت م']) || 0;
                        const frenchValuebem = parseFloat(rowData['الفرنسية ش ت م']) || 0;
                        const englishValuebem = parseFloat(rowData['الإنجليزية ش ت م']) || 0;
                        const islamicValuebem = parseFloat(rowData['ت إسلامية ش ت م']) || 0;
                        const civicsValuebem = parseFloat(rowData['ت مدنية ش ت م']) || 0;
                        const historyandgeographyValuebem = parseFloat(rowData['تاريخ جغرافيا ش ت م']) || 0;
                        const mathValuebem = parseFloat(rowData['رياضيات ش ت م']) || 0;
                        const natureValuebem = parseFloat(rowData['علوم ط ش ت م']) || 0;
                        const physicalValuebem = parseFloat(rowData['فيزياء ش ت م']) || 0;
                        const informaticsValuebem = parseFloat(rowData['معلوماتية ش ت م']) || 0;
                        const fineValuebem = parseFloat(rowData['ت تشكيلية ش ت م']) || 0;
                        const musicValuebem = parseFloat(rowData['ت موسيقية ش ت م']) || 0;
                        const athleticValuebem = parseFloat(rowData['ت بدنية ش ت م']) || 0;
                        const rateValuebem = parseFloat(rowData['معدل ش ت م']) || 0;

                        // Push the Annual scores to respective arrays
                        arabicScoresAnnual.push(arabicValueAnnual);
                        amazighScoresAnnual.push(amazighValueAnnual);
                        frenchScoresAnnual.push(frenchValueAnnual);
                        englishScoresAnnual.push(englishValueAnnual);
                        islamicScoresAnnual.push(islamicValueAnnual);
                        civicsScoresAnnual.push(civicsValueAnnual);
                        historyandgeographyScoresAnnual.push(historyandgeographyValueAnnual);
                        mathScoresAnnual.push(mathValueAnnual);
                        natureScoresAnnual.push(natureValueAnnual);
                        physicalScoresAnnual.push(physicalValueAnnual);
                        informaticsScoresAnnual.push(informaticsValueAnnual);
                        fineScoresAnnual.push(fineValueAnnual);
                        musicScoresAnnual.push(musicValueAnnual);
                        athleticScoresAnnual.push(athleticValueAnnual);
                        rateScoresAnnual.push(rateValueAnnual);

                        // Push the bem scores to respective arrays
                        arabicScoresbem.push(arabicValuebem);
                        amazighScoresbem.push(amazighValuebem);
                        frenchScoresbem.push(frenchValuebem);
                        englishScoresbem.push(englishValuebem);
                        islamicScoresbem.push(islamicValuebem);
                        civicsScoresbem.push(civicsValuebem);
                        historyandgeographyScoresbem.push(historyandgeographyValuebem);
                        mathScoresbem.push(mathValuebem);
                        natureScoresbem.push(natureValuebem);
                        physicalScoresbem.push(physicalValuebem);
                        informaticsScoresbem.push(informaticsValuebem);
                        fineScoresbem.push(fineValuebem);
                        musicScoresbem.push(musicValuebem);
                        athleticScoresbem.push(athleticValuebem);
                        rateScoresbem.push(rateValuebem);
                    });

                    // Calculate the differences between the paired observations
                    const arabicdifference = arabicScoresAnnual.map((value, index) => value - arabicScoresbem[index]);
                    const amazighdifference = amazighScoresAnnual.map((value, index) => value - amazighScoresbem[index]);
                    const frenchdifference = frenchScoresAnnual.map((value, index) => value - frenchScoresbem[index]);
                    const englishdifference = englishScoresAnnual.map((value, index) => value - englishScoresbem[index]);
                    const islamicdifference = islamicScoresAnnual.map((value, index) => value - islamicScoresbem[index]);
                    const civicsdifference = civicsScoresAnnual.map((value, index) => value - civicsScoresbem[index]);
                    const historyandgeographydifference = historyandgeographyScoresAnnual.map((value, index) => value - historyandgeographyScoresbem[index]);
                    const mathdifference = mathScoresAnnual.map((value, index) => value - mathScoresbem[index]);
                    const naturedifference = natureScoresAnnual.map((value, index) => value - natureScoresbem[index]);
                    const physicaldifference = physicalScoresAnnual.map((value, index) => value - physicalScoresbem[index]);
                    const informaticsdifference = informaticsScoresAnnual.map((value, index) => value - informaticsScoresbem[index]);
                    const finedifference = fineScoresAnnual.map((value, index) => value - fineScoresbem[index]);
                    const musicdifference = musicScoresAnnual.map((value, index) => value - musicScoresbem[index]);
                    const athleticdifference = athleticScoresAnnual.map((value, index) => value - athleticScoresbem[index]);
                    const ratedifference = rateScoresAnnual.map((value, index) => value - rateScoresbem[index]);

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
            let cvsumRatebem = 0;
            let cvsumRateup = 0;

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
            let cvsumSquaredDiffRatebem = 0;
            let cvsumSquaredDiffRateup = 0;

            // Calculate the sum for each subject
                table.rows().every(function() {
                    const rowData = this.data();

                cvsumArabic += parseFloat(rowData['العربية ش ت م']) || 0;
                cvsumAmazigh += parseFloat(rowData['الأمازيغية ش ت م']) || 0;
                cvsumFrench += parseFloat(rowData['الفرنسية ش ت م']) || 0;
                cvsumEnglish += parseFloat(rowData['الإنجليزية ش ت م']) || 0;
                cvsumIslamic += parseFloat(rowData['ت إسلامية ش ت م']) || 0;
                cvsumCivics += parseFloat(rowData['ت مدنية ش ت م']) || 0;
                cvsumHistoryAndGeography += parseFloat(rowData['تاريخ جغرافيا ش ت م']) || 0;
                cvsumMath += parseFloat(rowData['رياضيات ش ت م']) || 0;
                cvsumNature += parseFloat(rowData['علوم ط ش ت م']) || 0;
                cvsumPhysical += parseFloat(rowData['فيزياء ش ت م']) || 0;
                cvsumInformatics += parseFloat(rowData['معلوماتية ش ت م']) || 0;
                cvsumFine += parseFloat(rowData['ت تشكيلية ش ت م']) || 0;
                cvsumMusic += parseFloat(rowData['ت موسيقية ش ت م']) || 0;
                cvsumAthletic += parseFloat(rowData['ت بدنية ش ت م']) || 0;
                cvsumRate += parseFloat(rowData['المعدل السنوي']) || 0;
                cvsumRatebem += parseFloat(rowData['معدل ش ت م']) || 0;
                cvsumRateup += parseFloat(rowData['معدل الإنتقال']) || 0;

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
            let cvmeanRatebem = cvsumRatebem / totalRows;
            let cvmeanRateup = cvsumRateup / totalRows;

            // Iterate over each row to sum up the values for each subject
            table.rows().every(function() {
                const rowData = this.data();

                const arabicValue = parseFloat(rowData['العربية ش ت م']) || 0;
                const amazighValue = parseFloat(rowData['الأمازيغية ش ت م']) || 0;
                const frenchValue = parseFloat(rowData['الفرنسية ش ت م']) || 0;
                const englishValue = parseFloat(rowData['الإنجليزية ش ت م']) || 0;
                const islamicValue = parseFloat(rowData['ت إسلامية ش ت م']) || 0;
                const civicsValue = parseFloat(rowData['ت مدنية ش ت م']) || 0;
                const historyandgeographyValue = parseFloat(rowData['تاريخ جغرافيا ش ت م']) || 0;
                const mathValue = parseFloat(rowData['رياضيات ش ت م']) || 0;
                const natureValue = parseFloat(rowData['علوم ط ش ت م']) || 0;
                const physicalValue = parseFloat(rowData['فيزياء ش ت م']) || 0;
                const informaticsValue = parseFloat(rowData['معلوماتية ش ت م']) || 0;
                const fineValue = parseFloat(rowData['ت تشكيلية ش ت م']) || 0;
                const musicValue = parseFloat(rowData['ت موسيقية ش ت م']) || 0;
                const athleticValue = parseFloat(rowData['ت بدنية ش ت م']) || 0;
                const rateValue = parseFloat(rowData['المعدل السنوي']) || 0;
                const ratebemValue = parseFloat(rowData['معدل ش ت م']) || 0;
                const rateupValue = parseFloat(rowData['معدل الإنتقال']) || 0;

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
                cvsumSquaredDiffRatebem += Math.pow(ratebemValue - cvmeanRatebem, 2);
                cvsumSquaredDiffRateup += Math.pow(rateupValue - cvmeanRateup, 2);

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
            let cvstdvRatebem = Math.sqrt(cvsumSquaredDiffRatebem / (totalRows - 1));
            let cvstdvRateup = Math.sqrt(cvsumSquaredDiffRateup / (totalRows - 1));

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
            let cvRatebem = totalRows > 0 ? (cvstdvRatebem / cvmeanRatebem) * 100 : 0;
            let cvRateup = totalRows > 0 ? (cvstdvRateup / cvmeanRateup) * 100 : 0;

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
            let cvRatebemG1 = Math.abs((cvstdvRatebem * 3 / 2) - cvmeanRatebem);
            let cvRateupG1 = Math.abs((cvstdvRateup * 3 / 2) - cvmeanRateup);

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
            let cvRatebemG2 = Math.abs((cvstdvRatebem * 1 / 2) - cvmeanRatebem);
            let cvRateupG2 = Math.abs((cvstdvRateup * 1 / 2) - cvmeanRateup);

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
            let cvRatebemG3 = Math.abs((cvstdvRatebem * 1 / 2) + cvmeanRatebem);
            let cvRateupG3 = Math.abs((cvstdvRateup * 1 / 2) + cvmeanRateup);

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
            let cvRatebemG4 = Math.abs((cvstdvRatebem * 2 / 2) + cvmeanRatebem);
            let cvRateupG4 = Math.abs((cvstdvRateup * 2 / 2) + cvmeanRateup);


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
            let countratebemWeak = 0;
            let countrateupWeak = 0;

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
            let countratebemCloseto = 0;
            let countrateupCloseto = 0;

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
            let countratebemMedium = 0;
            let countrateupMedium = 0;

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
            let countratebemGood = 0;
            let countrateupGood = 0;

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
            let countratebemVeryGood = 0;
            let countrateupVeryGood = 0;

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
            let countratebemCV = 0;
            let countrateupCV = 0;

            table.rows().every(function() {
                const rowData = this.data();

                const arabicValue = parseFloat(rowData['العربية ش ت م']) || 0;
                const amazighValue = parseFloat(rowData['الأمازيغية ش ت م']) || 0;
                const frenchValue = parseFloat(rowData['الفرنسية ش ت م']) || 0;
                const englishValue = parseFloat(rowData['الإنجليزية ش ت م']) || 0;
                const islamicValue = parseFloat(rowData['ت إسلامية ش ت م']) || 0;
                const civicsValue = parseFloat(rowData['ت مدنية ش ت م']) || 0;
                const historyandgeographyValue = parseFloat(rowData['تاريخ جغرافيا ش ت م']) || 0;
                const mathValue = parseFloat(rowData['رياضيات ش ت م']) || 0;
                const natureValue = parseFloat(rowData['علوم ط ش ت م']) || 0;
                const physicalValue = parseFloat(rowData['فيزياء ش ت م']) || 0;
                const informaticsValue = parseFloat(rowData['معلوماتية ش ت م']) || 0;
                const fineValue = parseFloat(rowData['ت تشكيلية ش ت م']) || 0;
                const musicValue = parseFloat(rowData['ت موسيقية ش ت م']) || 0;
                const athleticValue = parseFloat(rowData['ت بدنية ش ت م']) || 0;
                const rateValue = parseFloat(rowData['المعدل السنوي']) || 0;
                const ratebemValue = parseFloat(rowData['معدل ش ت م']) || 0;
                const rateupValue = parseFloat(rowData['معدل الإنتقال']) || 0;

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
                if (ratebemValue > 0 && ratebemValue <= cvRatebemG1) {
                    countratebemWeak++;
                }
                if (rateupValue > 0 && rateupValue <= cvRateupG1) {
                    countrateupWeak++;
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
                if (ratebemValue > cvRatebemG1 && ratebemValue <= cvRatebemG2) {
                    countratebemCloseto++;
                }
                if (rateupValue > cvRateupG1 && rateupValue <= cvRateupG2) {
                    countrateupCloseto++;
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
                if (ratebemValue > cvRatebemG2 && ratebemValue <= cvRatebemG3) {
                    countratebemMedium++;
                }
                if (rateupValue > cvRateupG2 && rateupValue <= cvRateupG3) {
                    countrateupMedium++;
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
                if (ratebemValue > cvRatebemG3 && ratebemValue <= cvRatebemG4) {
                    countratebemGood++;
                }
                if (rateupValue > cvRateupG3 && rateupValue <= cvRateupG4) {
                    countrateupGood++;
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
                if (ratebemValue > cvRatebemG4 && ratebemValue <= 20) {
                    countratebemVeryGood++;
                }
                if (rateupValue > cvRateupG4 && rateupValue <= 20) {
                    countrateupVeryGood++;
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
                if (ratebemValue >= 1) {
                    countratebemCV++;
                }
                if (rateupValue >= 1) {
                    countrateupCV++;
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
            let RatebempercentageG1 = countratebemCV > 0 ? (countratebemWeak * 100) / countratebemCV : 0;
            let RateuppercentageG1 = countrateupCV > 0 ? (countrateupWeak * 100) / countrateupCV : 0;

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
            let RatebempercentageG2 = countratebemCV > 0 ? (countratebemCloseto * 100) / countratebemCV : 0;
            let RateuppercentageG2 = countrateupCV > 0 ? (countrateupCloseto * 100) / countrateupCV : 0;

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
            let RatebempercentageG3 = countratebemCV > 0 ? (countratebemMedium * 100) / countratebemCV : 0;
            let RateuppercentageG3 = countrateupCV > 0 ? (countrateupMedium * 100) / countrateupCV : 0;

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
            let RatebempercentageG4 = countratebemCV > 0 ? (countratebemGood * 100) / countratebemCV : 0;
            let RateuppercentageG4 = countrateupCV > 0 ? (countrateupGood * 100) / countrateupCV : 0;

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
            let RatebempercentageG5 = countratebemCV > 0 ? (countratebemVeryGood * 100) / countratebemCV : 0;
            let RateuppercentageG5 = countrateupCV > 0 ? (countrateupVeryGood * 100) / countrateupCV : 0;



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
                $('#ratebem-cv').text(cvRatebem.toFixed(2) + "%");
                $('#rateup-cv').text(cvRateup.toFixed(2) + "%");

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
                $('#ratebem-percentageG1').text(RatebempercentageG1.toFixed(2) + "%");
                $('#rateup-percentageG1').text(RateuppercentageG1.toFixed(2) + "%");

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
                $('#ratebem-percentageG2').text(RatebempercentageG2.toFixed(2) + "%");
                $('#rateup-percentageG2').text(RateuppercentageG2.toFixed(2) + "%");

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
                $('#ratebem-percentageG3').text(RatebempercentageG3.toFixed(2) + "%");
                $('#rateup-percentageG3').text(RateuppercentageG3.toFixed(2) + "%");

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
                $('#ratebem-percentageG4').text(RatebempercentageG4.toFixed(2) + "%");
                $('#rateup-percentageG4').text(RateuppercentageG4.toFixed(2) + "%");

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
                $('#ratebem-percentageG5').text(RatebempercentageG5.toFixed(2) + "%");
                $('#rateup-percentageG5').text(RateuppercentageG5.toFixed(2) + "%");

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
                $('#ratebem-countG1').text(countratebemWeak);
                $('#rateup-countG1').text(countrateupWeak);

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
                $('#ratebem-countG2').text(countratebemCloseto);
                $('#rateup-countG2').text(countrateupCloseto);

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
                $('#ratebem-countG3').text(countratebemMedium);
                $('#rateup-countG3').text(countrateupMedium);

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
                $('#ratebem-countG4').text(countratebemGood);
                $('#rateup-countG4').text(countrateupGood);

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
                $('#ratebem-countG5').text(countratebemVeryGood);
                $('#rateup-countG5').text(countrateupVeryGood);

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
                if (cvRatebem <= 15) {
                    $('#ratebem-cvNote').text("هناك إنسجام تام");
                } else if (cvRatebem <= 30 && cvRatebem > 15) {
                    $('#ratebem-cvNote').text("هناك إنسجام نسبي");
                } else if (cvRatebem > 30 && cvRatebem > 15) {
                    $('#ratebem-cvNote').text("هناك تشتت واختلاف");
                } else {
                    $('#ratebem-cvNote').text("-");
                }
                if (cvRateup <= 15) {
                    $('#rateup-cvNote').text("هناك إنسجام تام");
                } else if (cvRateup <= 30 && cvRateup > 15) {
                    $('#rateup-cvNote').text("هناك إنسجام نسبي");
                } else if (cvRateup > 30 && cvRateup > 15) {
                    $('#rateup-cvNote').text("هناك تشتت واختلاف");
                } else {
                    $('#rateup-cvNote').text("-");
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
//Pairedsimplettest Table Area chart
/////////////////////////////
var dataPairedsimplettest = [
    {
        subject: 'اللغة العربية', 
        valuetracePairedsimplettestAnnual: percentageArabicGreaterThanTenAnnual,
        valuetracePairedsimplettestbem: percentageArabicGreaterThanTen
    },

    {
        subject: 'اللغة اﻷمازيغية', 
        valuetracePairedsimplettestAnnual: percentageAmazighGreaterThanTenAnnual,
        valuetracePairedsimplettestbem: percentageAmazighGreaterThanTen
        },
    {
        subject: 'اللغة الفرنسية', 
        valuetracePairedsimplettestAnnual: percentageFrenchGreaterThanTenAnnual,
        valuetracePairedsimplettestbem: percentageFrenchGreaterThanTen
        },
    {
        subject: 'اللغة الإنجليزية', 
        valuetracePairedsimplettestAnnual: percentageEnglishGreaterThanTenAnnual,
        valuetracePairedsimplettestbem: percentageEnglishGreaterThanTen
        },
    {
        subject: 'التربية الإسلامية', 
        valuetracePairedsimplettestAnnual: percentageIslamicGreaterThanTenAnnual,
        valuetracePairedsimplettestbem: percentageIslamicGreaterThanTen
        },
    {
        subject: 'التربية المدنية', 
        valuetracePairedsimplettestAnnual: percentageCivicsGreaterThanTenAnnual,
        valuetracePairedsimplettestbem: percentageCivicsGreaterThanTen
        },
    {
        subject: 'التاريخ والجغرافيا', 
        valuetracePairedsimplettestAnnual: percentageHistoryAndGeographyGreaterThanTenAnnual,
        valuetracePairedsimplettestbem:  percentageHistoryAndGeographyGreaterThanTen
        },
    {
        subject: 'الرياضيات', 
        valuetracePairedsimplettestAnnual: percentageMathGreaterThanTenAnnual,
        valuetracePairedsimplettestbem: percentageMathGreaterThanTen
        },
    {
        subject: 'ع الطبيعة و الحياة', 
        valuetracePairedsimplettestAnnual: percentageNatureGreaterThanTenAnnual,
        valuetracePairedsimplettestbem: percentageNatureGreaterThanTen
        },
    {
        subject: 'ع الفيزيائية والتكنولوجيا', 
        valuetracePairedsimplettestAnnual: percentagePhysicalGreaterThanTenAnnual,
        valuetracePairedsimplettestbem: percentagePhysicalGreaterThanTen
        },
    {
        subject: 'المعلوماتية', 
        valuetracePairedsimplettestAnnual: percentageInformaticsGreaterThanTenAnnual,
        valuetracePairedsimplettestbem: percentageInformaticsGreaterThanTen
        },
    {
        subject: 'التربية التشكيلية', 
        valuetracePairedsimplettestAnnual: percentageFineGreaterThanTenAnnual,
        valuetracePairedsimplettestbem: percentageFineGreaterThanTen
        },
    {
        subject: 'التربية الموسيقية', 
        valuetracePairedsimplettestAnnual: percentageMusicGreaterThanTenAnnual,
        valuetracePairedsimplettestbem: percentageMusicGreaterThanTen
        },
    {
        subject: 'ت البدنية و الرياضية', 
        valuetracePairedsimplettestAnnual: percentageAthleticGreaterThanTenAnnual,
        valuetracePairedsimplettestbem: percentageAthleticGreaterThanTen
        },
    {
        subject: 'معدل الفصل 2', 
        valuetracePairedsimplettestAnnual: percentageRateGreaterThanTenAnnual,
        valuetracePairedsimplettestbem: percentageRateGreaterThanTen
        },

];

// Extract subject names and GreaterThanTen values
var subjectsPairedsimplettest = dataPairedsimplettest.map(item => item.subject);
var valuetracePairedsimplettestAnnual = dataPairedsimplettest.map(item => item.valuetracePairedsimplettestAnnual);
var valuetracePairedsimplettestbem = dataPairedsimplettest.map(item => item.valuetracePairedsimplettestbem);

// Create Bar Chart
var tracePairedsimplettestAnnual = {
    x: subjectsPairedsimplettest,
    y: valuetracePairedsimplettestAnnual,
    type: 'bar',
    name: 'أكبر أو يساوي 10'
};

var tracePairedsimplettestbem = {
    x: subjectsPairedsimplettest,
    y: valuetracePairedsimplettestbem,
    type: 'bar',
    name: 'من 08 الى 09.99'
};


var subjectsPairedsimplettest = [tracePairedsimplettestAnnual, tracePairedsimplettestbem];

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