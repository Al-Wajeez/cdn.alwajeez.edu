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
        fileInput.accept = ".html";
        fileInput.onchange = handleFileInputChange;
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

                const reader = new FileReader();
                reader.onload = function(e) {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheet_name_list = workbook.SheetNames;
                    const worksheet = workbook.Sheets[sheet_name_list[0]];
         
                    const columnsToImport = ['اللقب و الاسم','اللغة العربية','اللغة الفرنسية','التربية الإسلامية','التربية المدنية','التاريخ والجغرافيا','الرياضيات','ع الطبيعة و الحياة','ع الفيزيائية والتكنولوجيا','أ','ب','ج','د'];
                    const json_data = XLSX.utils.sheet_to_json(worksheet, { range: 1, header: 1, raw: false, dateNF: 'dd/mm/yyyy', defval: null, blankrows: false, dateNF: 'dd/mm/yyyy', header: columnsToImport });

                    // Remove the last row from json_data
                    json_data.splice(-4);

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

                    targets: 13,
                    render: function(data, type, row, meta) {
                        var A = parseFloat(row['أ']) || 0;
                        var B = parseFloat(row['ب']) || 0;
                        var C = parseFloat(row['ج']) || 0;
                        var D = parseFloat(row['د']) || 0;
                        var UP = A + B;
                        var DOWN = C + D;

                        var Followup = '-';
                        if (DOWN > UP) {
                            Followup = 'معني بالمتابعة';
                        } else if (DOWN < UP) {
                            Followup = 'غير معني بالمتابعة';
                        } else if (DOWN == UP) {
                        Followup = 'غير معني بالمتابعة';
                        } else {
                            Followup = '-';
                        }
                        return Followup;
                    }
                },
                {
                    targets: 14,
                    render: function(data, type, row, meta) {
                        var countarabicA = 0;
                        var countfrenchA = 0;
                        var countislamicA = 0;
                        var countcivicsA = 0;
                        var counthistorygeographyA = 0;
                        var countmathA = 0;
                        var countnatureLifeA = 0;
                        var countphysicA = 0;

                        var countarabicB = 0;
                        var countfrenchB = 0;
                        var countislamicB = 0;
                        var countcivicsB = 0;
                        var counthistorygeographyB = 0;
                        var countmathB = 0;
                        var countnatureLifeB = 0;
                        var countphysicB = 0;

                        try {
                            // Extracting values
                            var arabic = row['اللغة العربية'] || '';
                            var french = row['اللغة الفرنسية'] || '';
                            var islamic = row['التربية الإسلامية'] || '';
                            var civics = row['التربية المدنية'] || '';
                            var historygeography = row['التاريخ والجغرافيا'] || '';
                            var math = row['الرياضيات'] || '';
                            var natureLife = row['ع الطبيعة و الحياة'] || '';
                            var physic = row['ع الفيزيائية والتكنولوجيا'] || '';

                            // Count occurrences of "أ" and "ب"
                            countarabicA = (arabic.match(/أ/g) || []).length;
                            countfrenchA = (french.match(/أ/g) || []).length;
                            countislamicA = (islamic.match(/أ/g) || []).length;
                            countcivicsA = (civics.match(/أ/g) || []).length;
                            counthistorygeographyA = (historygeography.match(/أ/g) || []).length;
                            countmathA = (math.match(/أ/g) || []).length;
                            countnatureLifeA = (natureLife.match(/أ/g) || []).length;
                            countphysicA = (physic.match(/أ/g) || []).length;

                            countarabicB = (arabic.match(/ب/g) || []).length;
                            countfrenchB = (french.match(/ب/g) || []).length;
                            countislamicB = (islamic.match(/ب/g) || []).length;
                            countcivicsB = (civics.match(/ب/g) || []).length;
                            counthistorygeographyB = (historygeography.match(/ب/g) || []).length;
                            countmathB = (math.match(/ب/g) || []).length;
                            countnatureLifeB = (natureLife.match(/ب/g) || []).length;
                            countphysicB = (physic.match(/ب/g) || []).length;

                            var value = (countarabicB + countfrenchB + countislamicB + countcivicsB + counthistorygeographyB + countarabicA + countfrenchA + countislamicA + countcivicsA + counthistorygeographyA) / 10;
                            return value;
                        } catch (error) {
                            // If an error occurs (e.g., column data is missing), return an empty string
                            return '';
                        }
                    }
                },
                {
                    targets: 15,
                    render: function(data, type, row, meta) {
                        var countarabicA = 0;
                        var countfrenchA = 0;
                        var countislamicA = 0;
                        var countcivicsA = 0;
                        var counthistorygeographyA = 0;
                        var countmathA = 0;
                        var countnatureLifeA = 0;
                        var countphysicA = 0;

                        var countarabicB = 0;
                        var countfrenchB = 0;
                        var countislamicB = 0;
                        var countcivicsB = 0;
                        var counthistorygeographyB = 0;
                        var countmathB = 0;
                        var countnatureLifeB = 0;
                        var countphysicB = 0;

                        try {
                            // Extracting values
                            var arabic = row['اللغة العربية'] || '';
                            var french = row['اللغة الفرنسية'] || '';
                            var islamic = row['التربية الإسلامية'] || '';
                            var civics = row['التربية المدنية'] || '';
                            var historygeography = row['التاريخ والجغرافيا'] || '';
                            var math = row['الرياضيات'] || '';
                            var natureLife = row['ع الطبيعة و الحياة'] || '';
                            var physic = row['ع الفيزيائية والتكنولوجيا'] || '';

                            // Count occurrences of "أ" and "ب"
                            countarabicA = (arabic.match(/أ/g) || []).length;
                            countfrenchA = (french.match(/أ/g) || []).length;
                            countislamicA = (islamic.match(/أ/g) || []).length;
                            countcivicsA = (civics.match(/أ/g) || []).length;
                            counthistorygeographyA = (historygeography.match(/أ/g) || []).length;
                            countmathA = (math.match(/أ/g) || []).length;
                            countnatureLifeA = (natureLife.match(/أ/g) || []).length;
                            countphysicA = (physic.match(/أ/g) || []).length;

                            countarabicB = (arabic.match(/ب/g) || []).length;
                            countfrenchB = (french.match(/ب/g) || []).length;
                            countislamicB = (islamic.match(/ب/g) || []).length;
                            countcivicsB = (civics.match(/ب/g) || []).length;
                            counthistorygeographyB = (historygeography.match(/ب/g) || []).length;
                            countmathB = (math.match(/ب/g) || []).length;
                            countnatureLifeB = (natureLife.match(/ب/g) || []).length;
                            countphysicB = (physic.match(/ب/g) || []).length;

                            var value = (countmathA + countnatureLifeA + countphysicA + countmathB + countnatureLifeB + countphysicB) / 6;
                            return value;
                        } catch (error) {
                            // If an error occurs (e.g., column data is missing), return an empty string
                            return '';
                        }
                    }
                },
                {
                    targets: 16,
                    render: function(data, type, row, meta) {

                        var countarabicA = 0;
                        var countfrenchA = 0;
                        var countislamicA = 0;
                        var countcivicsA = 0;
                        var counthistorygeographyA = 0;
                        var countmathA = 0;
                        var countnatureLifeA = 0;
                        var countphysicA = 0;

                        var countarabicB = 0;
                        var countfrenchB = 0;
                        var countislamicB = 0;
                        var countcivicsB = 0;
                        var counthistorygeographyB = 0;
                        var countmathB = 0;
                        var countnatureLifeB = 0;
                        var countphysicB = 0;

                         // Extracting values
                            var arabic = row['اللغة العربية'] || '';
                            var french = row['اللغة الفرنسية'] || '';
                            var islamic = row['التربية الإسلامية'] || '';
                            var civics = row['التربية المدنية'] || '';
                            var historygeography = row['التاريخ والجغرافيا'] || '';
                            var math = row['الرياضيات'] || '';
                            var natureLife = row['ع الطبيعة و الحياة'] || '';
                            var physic = row['ع الفيزيائية والتكنولوجيا'] || '';

                            var A = parseFloat(row['أ']) || 0;
                            var B = parseFloat(row['ب']) || 0;
                            var C = parseFloat(row['ج']) || 0;
                            var D = parseFloat(row['د']) || 0;
                            var UPup = A + B;
                            var DOWNdown = C + D;

                            var Followup = '-';
                            if (DOWNdown > UPup) {
                                Followup = 'معني بالمتابعة';
                            } else if (DOWNdown < UPup) {
                                Followup = 'غير معني بالمتابعة';
                            } else if (DOWNdown == UPup) {
                            Followup = 'ملمح غير واضح';
                            } else {
                                Followup = '-';
                            }

                            // Count occurrences of "أ" and "ب"
                            countarabicA = (arabic.match(/أ/g) || []).length;
                            countfrenchA = (french.match(/أ/g) || []).length;
                            countislamicA = (islamic.match(/أ/g) || []).length;
                            countcivicsA = (civics.match(/أ/g) || []).length;
                            counthistorygeographyA = (historygeography.match(/أ/g) || []).length;
                            countmathA = (math.match(/أ/g) || []).length;
                            countnatureLifeA = (natureLife.match(/أ/g) || []).length;
                            countphysicA = (physic.match(/أ/g) || []).length;

                            countarabicB = (arabic.match(/ب/g) || []).length;
                            countfrenchB = (french.match(/ب/g) || []).length;
                            countislamicB = (islamic.match(/ب/g) || []).length;
                            countcivicsB = (civics.match(/ب/g) || []).length;
                            counthistorygeographyB = (historygeography.match(/ب/g) || []).length;
                            countmathB = (math.match(/ب/g) || []).length;
                            countnatureLifeB = (natureLife.match(/ب/g) || []).length;
                            countphysicB = (physic.match(/ب/g) || []).length;

                            var UP = (countarabicB + countfrenchB + countislamicB + countcivicsB + counthistorygeographyB + countarabicA + countfrenchA + countislamicA + countcivicsA + counthistorygeographyA) / 10;
                            var DOWN = (countmathA + countnatureLifeA + countphysicA + countmathB + countnatureLifeB + countphysicB) / 6;

                        var Profile = '';
                        if (DOWN < UP && Followup === "معني بالمتابعة") {
                            Profile = 'المواد العلمية';
                        } else if (DOWN > UP && Followup === "معني بالمتابعة") {
                            Profile = 'المواد الآدبية';
                        } else if (DOWN == UP && Followup === "معني بالمتابعة") {
                        Profile = 'ملمح غير واضح';
                        } else {
                            Profile = '';
                        }
                        return Profile;
                    }
                },
                {
                    targets: [1, 2, 3, 4, 5, 6, 7, 8, 14, 15],
                    visible: false
                },
                {
                    targets: '_all',
                    className: 'dt-body-center'
                }
            ],
            order: [[0, "asc"]],
            columns: [
                { data: 'اللقب و الاسم' },
                { data: 'اللغة العربية' },
                { data: 'اللغة الفرنسية' },
                { data: 'التربية الإسلامية' },
                { data: 'التربية المدنية' },
                { data: 'التاريخ والجغرافيا' },
                { data: 'الرياضيات' },
                { data: 'ع الطبيعة و الحياة' },
                { data: 'ع الفيزيائية والتكنولوجيا' },
                { data: 'أ' },
                { data: 'ب' },
                { data: 'ج' },
                { data: 'د' },
                { data: null},
                { data: null},
                { data: null},
                { data: null},
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
            // Count the number of values greater than 1 in 'اللغة العربية' and 'اللغة اﻷمازيغية'
            let countarabicA = 0;
            let countfrenchA = 0;
            let countislamicA = 0;
            let countcivicsA = 0;
            let counthistoryandgeographyA = 0;
            let countmathA = 0;
            let countnatureA = 0;
            let countphysicalA = 0;

            let countarabicB = 0;
            let countfrenchB = 0;
            let countislamicB = 0;
            let countcivicsB = 0;
            let counthistoryandgeographyB = 0;
            let countmathB = 0;
            let countnatureB = 0;
            let countphysicalB = 0;

            let countarabicC = 0;
            let countfrenchC = 0;
            let countislamicC = 0;
            let countcivicsC = 0;
            let counthistoryandgeographyC = 0;
            let countmathC = 0;
            let countnatureC = 0;
            let countphysicalC = 0;

            let countarabicD = 0;
            let countfrenchD = 0;
            let countislamicD = 0;
            let countcivicsD = 0;
            let counthistoryandgeographyD = 0;
            let countmathD = 0;
            let countnatureD = 0;
            let countphysicalD = 0;

            // Iterate over each row in the DataTable
            table.rows().every(function() {
                const rowData = this.data();

                // Extracting values for each subject
                var arabicValue = rowData['اللغة العربية'] || '';
                var frenchValue = rowData['اللغة الفرنسية'] || '';
                var islamicValue = rowData['التربية الإسلامية'] || '';
                var civicsValue = rowData['التربية المدنية'] || '';
                var historyandgeographyValue = rowData['التاريخ والجغرافيا'] || '';
                var mathValue = rowData['الرياضيات'] || '';
                var natureValue = rowData['ع الطبيعة و الحياة'] || '';
                var physicalValue = rowData['ع الفيزيائية والتكنولوجيا'] || '';

                // Count occurrences of pattern "أ" for each subject
                countarabicA += (arabicValue.match(/أ/g) || []).length;
                countfrenchA += (frenchValue.match(/أ/g) || []).length;
                countislamicA += (islamicValue.match(/أ/g) || []).length;
                countcivicsA += (civicsValue.match(/أ/g) || []).length;
                counthistoryandgeographyA += (historyandgeographyValue.match(/أ/g) || []).length;
                countmathA += (mathValue.match(/أ/g) || []).length;
                countnatureA += (natureValue.match(/أ/g) || []).length;
                countphysicalA += (physicalValue.match(/أ/g) || []).length;

                countarabicB += (arabicValue.match(/ب/g) || []).length;
                countfrenchB += (frenchValue.match(/ب/g) || []).length;
                countislamicB += (islamicValue.match(/ب/g) || []).length;
                countcivicsB += (civicsValue.match(/ب/g) || []).length;
                counthistoryandgeographyB += (historyandgeographyValue.match(/ب/g) || []).length;
                countmathB += (mathValue.match(/ب/g) || []).length;
                countnatureB += (natureValue.match(/ب/g) || []).length;
                countphysicalB += (physicalValue.match(/ب/g) || []).length;

                countarabicC += (arabicValue.match(/ج/g) || []).length;
                countfrenchC += (frenchValue.match(/ج/g) || []).length;
                countislamicC += (islamicValue.match(/ج/g) || []).length;
                countcivicsC += (civicsValue.match(/ج/g) || []).length;
                counthistoryandgeographyC += (historyandgeographyValue.match(/ج/g) || []).length;
                countmathC += (mathValue.match(/ج/g) || []).length;
                countnatureC += (natureValue.match(/ج/g) || []).length;
                countphysicalC += (physicalValue.match(/ج/g) || []).length;

                countarabicD += (arabicValue.match(/د/g) || []).length;
                countfrenchD += (frenchValue.match(/د/g) || []).length;
                countislamicD += (islamicValue.match(/د/g) || []).length;
                countcivicsD += (civicsValue.match(/د/g) || []).length;
                counthistoryandgeographyD += (historyandgeographyValue.match(/د/g) || []).length;
                countmathD += (mathValue.match(/د/g) || []).length;
                countnatureD += (natureValue.match(/د/g) || []).length;
                countphysicalD += (physicalValue.match(/د/g) || []).length;
            });

            // Calculate the total number of rows
            const totalRows = table.rows().count();

            // Calculate the percentage of values greater than or equal to 10 for each subject
            const percentageArabicA = (countarabicA / totalRows) * 100;
            const percentageFrenchA = (countfrenchA / totalRows) * 100;
            const percentageIslamicA = (countislamicA / totalRows) * 100;
            const percentageCivicsA = (countcivicsA / totalRows) * 100;
            const percentageHistoryAndGeographyA = (counthistoryandgeographyA / totalRows) * 100;
            const percentageMathA = (countmathA / totalRows) * 100;
            const percentageNatureA = (countnatureA / totalRows) * 100;
            const percentagePhysicalA = (countphysicalA / totalRows) * 100;

            const percentageArabicB = (countarabicB / totalRows) * 100;
            const percentageFrenchB = (countfrenchB / totalRows) * 100;
            const percentageIslamicB = (countislamicB / totalRows) * 100;
            const percentageCivicsB = (countcivicsB / totalRows) * 100;
            const percentageHistoryAndGeographyB = (counthistoryandgeographyB / totalRows) * 100;
            const percentageMathB = (countmathB / totalRows) * 100;
            const percentageNatureB = (countnatureB / totalRows) * 100;
            const percentagePhysicalB = (countphysicalB / totalRows) * 100;

            const percentageArabicC = (countarabicC / totalRows) * 100;
            const percentageFrenchC = (countfrenchC / totalRows) * 100;
            const percentageIslamicC = (countislamicC / totalRows) * 100;
            const percentageCivicsC = (countcivicsC / totalRows) * 100;
            const percentageHistoryAndGeographyC = (counthistoryandgeographyC / totalRows) * 100;
            const percentageMathC = (countmathC / totalRows) * 100;
            const percentageNatureC = (countnatureC / totalRows) * 100;
            const percentagePhysicalC = (countphysicalC / totalRows) * 100;

            const percentageArabicD = (countarabicD / totalRows) * 100;
            const percentageFrenchD = (countfrenchD / totalRows) * 100;
            const percentageIslamicD = (countislamicD / totalRows) * 100;
            const percentageCivicsD = (countcivicsD / totalRows) * 100;
            const percentageHistoryAndGeographyD = (counthistoryandgeographyD / totalRows) * 100;
            const percentageMathD = (countmathD / totalRows) * 100;
            const percentageNatureD = (countnatureD / totalRows) * 100;
            const percentagePhysicalD = (countphysicalD / totalRows) * 100;

            const followupcountA = countarabicA + countfrenchA + countislamicA + countcivicsA + counthistoryandgeographyA + countmathA + countnatureA + countphysicalA;
            const followupcountB = countarabicB + countfrenchB + countislamicB + countcivicsB + counthistoryandgeographyB + countmathB + countnatureB + countphysicalB;
            const followupcountC = countarabicC + countfrenchC + countislamicC + countcivicsC + counthistoryandgeographyC + countmathC + countnatureC + countphysicalC;
            const followupcountD = countarabicD + countfrenchD + countislamicD + countcivicsD + counthistoryandgeographyD + countmathD + countnatureD + countphysicalD;
            const followuptotal = followupcountA + followupcountB + followupcountC + followupcountD
            const followuppercentageA = (followupcountA / followuptotal) * 100;;
            const followuppercentageB = (followupcountB / followuptotal) * 100;;
            const followuppercentageC = (followupcountC / followuptotal) * 100;;
            const followuppercentageD = (followupcountD / followuptotal) * 100;;


                // Update the content of the HTML elements with the counts and percentages
                $('#arabic-countA').text(countarabicA);
                $('#french-countA').text(countfrenchA);
                $('#islamic-countA').text(countislamicA);
                $('#civics-countA').text(countcivicsA);
                $('#historyandgeography-countA').text(counthistoryandgeographyA);
                $('#math-countA').text(countmathA);
                $('#nature-countA').text(countnatureA);
                $('#physical-countA').text(countphysicalA);

                $('#arabic-countB').text(countarabicB);
                $('#french-countB').text(countfrenchB);
                $('#islamic-countB').text(countislamicB);
                $('#civics-countB').text(countcivicsB);
                $('#historyandgeography-countB').text(counthistoryandgeographyB);
                $('#math-countB').text(countmathB);
                $('#nature-countB').text(countnatureB);
                $('#physical-countB').text(countphysicalB);

                $('#arabic-countC').text(countarabicC);
                $('#french-countC').text(countfrenchC);
                $('#islamic-countC').text(countislamicC);
                $('#civics-countC').text(countcivicsC);
                $('#historyandgeography-countC').text(counthistoryandgeographyC);
                $('#math-countC').text(countmathC);
                $('#nature-countC').text(countnatureC);
                $('#physical-countC').text(countphysicalC);

                $('#arabic-countD').text(countarabicD);
                $('#french-countD').text(countfrenchD);
                $('#islamic-countD').text(countislamicD);
                $('#civics-countD').text(countcivicsD);
                $('#historyandgeography-countD').text(counthistoryandgeographyD);
                $('#math-countD').text(countmathD);
                $('#nature-countD').text(countnatureD);
                $('#physical-countD').text(countphysicalD);

                // Update the content of the HTML elements with the counts and percentages
                $('#arabic-percentageA').text(percentageArabicA.toFixed(2) + "%");
                $('#french-percentageA').text(percentageFrenchA.toFixed(2) + "%");
                $('#islamic-percentageA').text(percentageIslamicA.toFixed(2) + "%");
                $('#civics-percentageA').text(percentageCivicsA.toFixed(2) + "%");
                $('#historyandgeography-percentageA').text(percentageHistoryAndGeographyA.toFixed(2) + "%");
                $('#math-percentageA').text(percentageMathA.toFixed(2) + "%");
                $('#nature-percentageA').text(percentageNatureA.toFixed(2) + "%");
                $('#physical-percentageA').text(percentagePhysicalA.toFixed(2) + "%");

                $('#arabic-percentageB').text(percentageArabicB.toFixed(2) + "%");
                $('#french-percentageB').text(percentageFrenchB.toFixed(2) + "%");
                $('#islamic-percentageB').text(percentageIslamicB.toFixed(2) + "%");
                $('#civics-percentageB').text(percentageCivicsB.toFixed(2) + "%");
                $('#historyandgeography-percentageB').text(percentageHistoryAndGeographyB.toFixed(2) + "%");
                $('#math-percentageB').text(percentageMathB.toFixed(2) + "%");
                $('#nature-percentageB').text(percentageNatureB.toFixed(2) + "%");
                $('#physical-percentageB').text(percentagePhysicalB.toFixed(2) + "%");

                $('#arabic-percentageC').text(percentageArabicC.toFixed(2) + "%");
                $('#french-percentageC').text(percentageFrenchC.toFixed(2) + "%");
                $('#islamic-percentageC').text(percentageIslamicC.toFixed(2) + "%");
                $('#civics-percentageC').text(percentageCivicsC.toFixed(2) + "%");
                $('#historyandgeography-percentageC').text(percentageHistoryAndGeographyC.toFixed(2) + "%");
                $('#math-percentageC').text(percentageMathC.toFixed(2) + "%");
                $('#nature-percentageC').text(percentageNatureC.toFixed(2) + "%");
                $('#physical-percentageC').text(percentagePhysicalC.toFixed(2) + "%");

                $('#arabic-percentageD').text(percentageArabicD.toFixed(2) + "%");
                $('#french-percentageD').text(percentageFrenchD.toFixed(2) + "%");
                $('#islamic-percentageD').text(percentageIslamicD.toFixed(2) + "%");
                $('#civics-percentageD').text(percentageCivicsD.toFixed(2) + "%");
                $('#historyandgeography-percentageD').text(percentageHistoryAndGeographyD.toFixed(2) + "%");
                $('#math-percentageD').text(percentageMathD.toFixed(2) + "%");
                $('#nature-percentageD').text(percentageNatureD.toFixed(2) + "%");
                $('#physical-percentageD').text(percentagePhysicalD.toFixed(2) + "%");

                $('#followup-countA').text(followupcountA);
                $('#followup-percentageA').text(followuppercentageA.toFixed(2) + "%");
                $('#followup-countB').text(followupcountB);
                $('#followup-percentageB').text(followuppercentageB.toFixed(2) + "%");
                $('#followup-countC').text(followupcountC);
                $('#followup-percentageC').text(followuppercentageC.toFixed(2) + "%");
                $('#followup-countD').text(followupcountD);
                $('#followup-percentageD').text(followuppercentageD.toFixed(2) + "%");

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

                /////////////////////////////
                //Greater 10 Table Area chart
                /////////////////////////////
                var dataGreater = [
                    {
                        subject: 'اللغة العربية', 
                        A: percentageArabicA,
                        B: percentageArabicB,
                        C: percentageArabicC,
                        D: percentageArabicD
                        
                    },
                    {
                        subject: 'اللغة الفرنسية', 
                        A: percentageFrenchA,
                        B: percentageFrenchB,
                        C: percentageFrenchC,
                        D: percentageFrenchD
                        
                        },
                    {
                        subject: 'التربية الإسلامية', 
                        A: percentageIslamicA,
                        B: percentageIslamicB,
                        C: percentageIslamicC,
                        D: percentageIslamicD
                        
                        },
                    {
                        subject: 'التربية المدنية', 
                        A: percentageCivicsA,
                        B: percentageCivicsB,
                        C: percentageCivicsC,
                        D: percentageCivicsD
                        
                        },
                    {
                        subject: 'التاريخ والجغرافيا', 
                        A: percentageHistoryAndGeographyA,
                        B: percentageHistoryAndGeographyB,
                        C: percentageHistoryAndGeographyC,
                        D: percentageHistoryAndGeographyD
                        
                        },
                    {
                        subject: 'الرياضيات', 
                        A: percentageMathA,
                        B: percentageMathB,
                        C: percentageMathC,
                        D: percentageMathD
                        
                        },
                    {
                        subject: 'ع الطبيعة و الحياة', 
                        A: percentageNatureA,
                        B: percentageNatureB,
                        C: percentageNatureC,
                        D: percentageNatureD
                        
                        },
                    {
                        subject: 'ع الفيزيائية والتكنولوجيا', 
                        A: percentagePhysicalA,
                        B: percentagePhysicalB,
                        C: percentagePhysicalC,
                        D: percentagePhysicalD
                        
                        },

                ];

                // Extract subject names and GreaterThanTen values
                var subjectsGreater = dataGreater.map(item => item.subject);
                var A = dataGreater.map(item => item.A);
                var B = dataGreater.map(item => item.B);
                var C = dataGreater.map(item => item.C);
                var D = dataGreater.map(item => item.D);

                // Create Bar Chart
                var traceA = {
                    x: subjectsGreater,
                    y: A,
                    type: 'bar',
                    name: 'تقدير أقصى'
                };

                var traceB = {
                    x: subjectsGreater,
                    y: B,
                    type: 'bar',
                    name: 'تقدير مقبول'
                };

                var traceC = {
                    x: subjectsGreater,
                    y: C,
                    type: 'bar',
                    name: 'تقدير جزئي'
                };

                var traceD = {
                    x: subjectsGreater,
                    y: D,
                    type: 'bar',
                    name: 'تقدير أدني'
                };

                var tracedataGreater = [traceA, traceB, traceC, traceD];

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
                Plotly.newPlot('Followup-chart', tracedataGreater, layoutGreater, {displaylogo: false});
                });

                }
// Attach an event listener to the button
$('#calculate-button').on('click', function() {
    // Call the function to perform the calculation when the button is clicked
    performCalculation();
});

       }

});