// use ajax request to load bills and categories from csv files
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "categories.csv",
        dataType: "text",
        success: function(data) { processCategoryData(data); },
        cache: false
    }).then(function() {
        $.ajax({
            type: "GET",
            url: "bill.csv",
            dataType: "text",
            success: function(data) { processBillData(data); },
            cache: false
        });
    });
});

var categories = [];
// function to process category data
function processCategoryData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    // var categories = [];

    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
            var tarr = new Object();
            for (var j = 0; j < headers.length; j++) {
                tarr[headers[j]] = data[j];
            }
            categories.push(tarr);
        }
    }

    var options = "";
    categories.forEach(category => {
        options += "<option value='" + category.id + "'>" + category.name + "</option>";
    });
    $('select[name="category"]').append(options);
}

// function to process bill data before listing on the webpage
function processBillData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var bills = [];

    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
            var tarr = new Object();
            for (var j = 0; j < headers.length; j++) {
                tarr[headers[j]] = data[j];
            }
            bills.push(tarr);
        }
    }

    listAllData(bills);
}

// function to list all bill data
function listAllData(bills) {
    var billTable = document.getElementById("billTable");

    var sum_income = 0;
    var sum_expenditure = 0;

    bills.forEach(bill => {
        var row = billTable.insertRow(-1);
        var type = row.insertCell(0);
        var time = row.insertCell(1);
        var category = row.insertCell(2);
        var amount = row.insertCell(3);

        if (bill.type == '0') {
            type.innerHTML = '支出';
            // sum up all expenditure amount
            sum_expenditure += parseFloat(bill.amount);
        }
        else {
            type.innerHTML = '收入';
            // sum up all income amount
            sum_income += parseFloat(bill.amount);
        }
        time.innerHTML = new Date(parseInt(bill.time)).toISOString();
        category.innerHTML = categories.find(category => category.id == bill.category).name;
        amount.innerHTML = bill.amount;
    });

    var statTable = document.getElementById("statTable");
    var statRow = statTable.insertRow(-1);
    var income = statRow.insertCell(0);
    var expenditure = statRow.insertCell(1);
    income.innerHTML = sum_income;
    expenditure.innerHTML = sum_expenditure;
}

// function to list bill data in a specific month
function listMonthData(month) {
    var billTable = document.getElementById("billTable");

    var sum_income = 0;
    var sum_expenditure = 0;
    for (var i = 1; i < billTable.getElementsByTagName("tr").length; i++) {
        if (month == 0) {
            // show all data
            billTable.rows[i].style.display = '';

            if (billTable.rows[i].cells[0].innerHTML == '支出') {
                // sum up all expenditure amount
                sum_expenditure += parseFloat(billTable.rows[i].cells[3].innerHTML);
            }
            else {
                // sum up all income amount
                sum_income += parseFloat(billTable.rows[i].cells[3].innerHTML);
            }
        }
        else {
            if (new Date(billTable.rows[i].cells[1].innerHTML).getUTCMonth() + 1 == month) {
                // show data for the selected month
                billTable.rows[i].style.display = '';

                if (billTable.rows[i].cells[0].innerHTML == '支出') {
                    // sum up expenditure amount for the selected month
                    sum_expenditure += parseFloat(billTable.rows[i].cells[3].innerHTML);
                }
                else {
                    // sum up income amount for the selected month
                    sum_income += parseFloat(billTable.rows[i].cells[3].innerHTML);
                }
            }
            else {
                // hide data for all other months
                billTable.rows[i].style.display = 'none';
            }
        }
    }

    var statTable = document.getElementById("statTable");
    statTable.rows[1].cells[0].innerHTML = sum_income;
    statTable.rows[1].cells[1].innerHTML = sum_expenditure;
}

function addBill() {
    // check required fields
    if (!document.getElementById("time").value) {
        alert("请输入账单时间！");
        return;
    }
    else if (!document.getElementById("amount").value) {
        alert("请输入账单金额！");
        return;
    }

    var billTable = document.getElementById("billTable");
    var row = billTable.insertRow(-1);
    var type = row.insertCell(0);
    var time = row.insertCell(1);
    var category = row.insertCell(2);
    var amount = row.insertCell(3);

    type.innerHTML = document.getElementById("type").value == '0' ? '支出' : '收入';
    time.innerHTML = new Date(Date.parse(document.getElementById("time").value)).toISOString();
    var cat = document.getElementById("category");
    category.innerHTML = cat.options[cat.selectedIndex].text;
    amount.innerHTML = document.getElementById("amount").value;

    listMonthData(0);

    alert("新增账单成功！");
}
