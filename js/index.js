/*
    Name: Adam Gaudreau, adam_gaudreau@student.uml.edu
    Computer Science Department, UMass Lowell
    Comp.4610, GUI Programming I
    File: /usr/cs/2018/agaudrea/public_html/461f2017/hw6/js/index.js
    Created: 15 November 2017
    Last updated by AG: 15 November 2017
*/

BASE_VALIDATION = {
    errorClass: "error",
    submitHandler: function() {/* what to do when submit */},
    rules: {
        "x-min": {
            required: true,
            min: 0
        },
        "x-max": {
            required: true,
            min: function() {
                return parseFloat($("input[name='x-min']").val()) + 1;
            }
        },
        "y-min": {
            required: true,
            min: 0
        },
        "y-max": {
            required: true,
            min: function() {
                return parseFloat($("input[name='y-min']").val()) + 1;
            }
        }
    },
    messages: {
        "x-max": {
            min: "X must be at least 1 greater than the minimum price."
        },
        "y-max": {
            min: "Y must be at least 1 greater than the minimum mpg."
        }
    }
}

BASE_VALUES = {
    msrp: {
        "min": 0,
        "max": 1000000,
        "values": [20000, 50000]
    },
    mpg: {
        "min": 1,
        "max": 200,
        "values": [10, 100]
    },
    insurance: {
        "min": 0,
        "max": 10000,
        "values": [100, 1000]
    },
    upkeep: {
        "min": 0,
        "max": 100000,
        "values": [500, 2000]
    }
}

// When the document loads, set up the listeners for events
$('document').ready(function() {
    // Setup tabs
    $('#tabs').tabs();
    $('#tabs').find(".ui-tabs-nav").sortable({
        axis: "x",
        stop: function() {
            tabs.tabs("refresh");
        }
    });
    addTab();
    // Setup sliders to default
    setupSliders($('#form1'), ["msrp", "mpg"]);
    // Setup validate for first form
    $('#form1').validate(BASE_VALIDATION);
});

function setupSliders(root, op) {
    var inputMin = [root.find("input[name='x-min']"), root.find("input[name='y-min']")],
        inputMax = [root.find("input[name='x-max']"), root.find("input[name='y-max']")],
        slider = [root.find("#slider-x"), root.find("#slider-y")];
    // Clear both sliders
    slider[0].html("");
    slider[1].html("");
    // Slider X
    slider[0].slider({
        range: true,
        min: BASE_VALUES[op[0]]['min'],
        max: BASE_VALUES[op[0]]['max'],
        values: BASE_VALUES[op[0]]['values'],
        slide: function(event, ui) {
            root.valid();
            inputMin[0].val(ui.values[0]);
            inputMax[0].val(ui.values[1]);
        }
    });
    inputMin[0].val(slider[0].slider("values", 0));
    inputMax[0].val(slider[0].slider("values", 1));
    inputMin[0].on('keyup', function() {
        slider[0].slider("values", 0, $(this).val());
    });
    inputMax[0].on('keyup', function() {
        slider[0].slider("values", 1, $(this).val());
    });
    // Slider Y
    slider[1].slider({
        range: true,
        min: BASE_VALUES[op[1]]['min'],
        max: BASE_VALUES[op[1]]['max'],
        values: BASE_VALUES[op[1]]['values'],
        slide: function(event, ui) {
            root.valid();
            inputMin[1].val(ui.values[0]);
            inputMax[1].val(ui.values[1]);
        }
    });
    inputMin[1].val(slider[1].slider("values", 0));
    inputMax[1].val(slider[1].slider("values", 1));
    inputMin[1].on('keyup', function() {
        slider[1].slider("values", 0, $(this).val());
    });
    inputMax[1].on('keyup', function() {
        slider[1].slider("values", 1, $(this).val());
    });
}

function changeAxis(id, value) {
    var activeIndex = $("#tabs").tabs('option', 'active') + 1;
    var tab = $("#tab" + activeIndex), xVal, yVal, changed, changedVal, newVal;
    if (id.includes("x")) { 
        xVal = value;
        changedVal = tab.find("#dropdownXAxis").html();
        // Change dropdown options
        tab.find("#" + id).html(changedVal);
        if (tab.find("#option-y-1").html() == value) {
            tab.find("#option-y-1").html(changedVal);
        } else {
            tab.find("#option-y-2").html(changedVal);
        }
        // Update labels
        tab.find("#dropdownXAxis").html(xVal);
        tab.find("#label-x-min").html(xVal + " Min");
        tab.find("#label-x-max").html(xVal + " Max");
    } else {
        xVal = tab.find("#dropdownXAxis").html();
    }
    if (id.includes("y")) { 
        yVal = value; 
        changedVal = tab.find("#dropdownYAxis").html();
        // Change dropdown options
        tab.find("#" + id).html(changedVal);
        if (tab.find("#option-x-1").html() == value) {
            tab.find("#option-x-1").html(changedVal);
        } else {
            tab.find("#option-x-2").html(changedVal);
        }
        // Update labels
        tab.find("#dropdownYAxis").html(yVal);
        tab.find("#label-y-min").html(yVal + " Min");
        tab.find("#label-y-max").html(yVal + " Max");
    } else {
        yVal = tab.find("#dropdownYAxis").html();
    }
    // Change tab name
    $('#tab-name-' + activeIndex).html(xVal + " / " + yVal);
    // Change sliders and default values
    setupSliders(tab.find('form'), [xVal.toLowerCase(), yVal.toLowerCase()]);
}

function submit() {
    var activeIndex = $("#tabs").tabs('option', 'active') + 1;
    var tab = $("#tab" + activeIndex);
    var form = tab.find('form'), results = tab.find('.results'), but = tab.find('#button-submit'), title = tab.find('.section-title');
    // See if we are making table or editting
    if (but.html() == "Submit") {
        // If form is valid...
        if (form.valid()) {
            // Make table and switch divs
            makeTable();
            but.html("Edit");
            title.html("Results");
            form.hide();
            results.show();
            results.attr("hidden", false);
        }
    } else {
        but.html("Submit");
        title.html("Enter table data");
        results.hide();
        form.show();
    }

}

// Take the data from the templates and make a table
function makeTable() {
    var arrX = [], arrY = [];
    var activeIndex = $("#tabs").tabs('option', 'active') + 1;
    var tab = $("#tab" + activeIndex);
    var headerRoot = tab.find('#table-x'), bodyRoot = tab.find('#table-body');
    // Clear previous table
    headerRoot.html("<th id=\"table-params\"></th>");
    bodyRoot.html("");
    headerParams = tab.find('#table-params')
    // Get X and Y min and max
    var xMin = parseFloat(tab.find("input[name='x-min']").val()), xMax = parseFloat(tab.find("input[name='x-max']").val()), xInt = (xMax - xMin) / 10;
    var yMin = parseFloat(tab.find("input[name='y-min']").val()), yMax = parseFloat(tab.find("input[name='y-max']").val()), yInt = (yMax - yMin) / 10;
    for (var i = 0; i < 11; i++) {
        arrX.push(Math.ceil(xMin + (xInt * i)));
        arrY.push(Math.ceil(yMin + (yInt * i)));
    }
    // Make the header
    headerParams.html(tab.find("#dropdownXAxis").html() + " / " + tab.find("#dropdownYAxis").html());
    for (var i = 0; i < arrX.length; i++) {
        headerRoot.html(headerRoot.html() + "\n<th class=\"table-root\">$" + arrX[i] + "</th>");
    }
    // Fill in rows
    for (var i = 0; i < arrY.length; i++) {
        bodyRoot.html(function() {
            var result = bodyRoot.html() + "\n<tr>\n<th scope=\"row\" class=\"table-root\">" + arrY[i] + "</th>";
            for (var x = 0; x < arrX.length; x++) {
                result += "\n<td>$";
                result += Math.round((arrX[x] / arrY[i])) + "</td>\n";
            }
            result += "\n</tr>";
            return result;
        });
    }
}

function addTab() {
    // Copy a div in, change id of tab
    var newTab = $('#tab-template').clone(), numTabs = $("#tabs >ul >li").size();
    newTab.attr("id", "tab" + numTabs);
    newTab.removeAttr("hidden");
    newTab.find("form").removeAttr("id");
    $('#tabs').append(newTab);
    // Setup sliders and validation
    var xVal = newTab.find("#dropdownXAxis").html(), yVal = newTab.find("#dropdownYAxis").html();
    setupSliders($("#tab" + numTabs + " > form"), [xVal.toLowerCase(), yVal.toLowerCase()]);
    var valJson = BASE_VALIDATION;
    valJson["rules"]["x-max"]["min"] = function() { return parseFloat(newTab.find("input[name='x-min']").val()) + 1; }
    valJson["rules"]["y-max"]["min"] = function() { return parseFloat(newTab.find("input[name='y-min']").val()) + 1; }
    $("#tab" + numTabs + " > form").validate(valJson);
    // Add new tab before + tab
    $('li[aria-labelledby="tab-add-tab"]').before("<li><a id=\"tab-name-" + numTabs + "\" href=\"#tab" + numTabs + "\">" + xVal + " / " + yVal + "</a> <span class=\"ui-icon ui-icon-close\" role=\"presentation\" onclick=\"closeTab($(this))\">Remove Tab</span></li>");
    $('#tabs').tabs("refresh");
    // Set active tab to new tab
    $("#tabs").tabs("option", "active", numTabs - 1);
}

function closeTab(element) {
    var divToRemove = element.closest("li").remove().attr("aria-controls");
    $("#" + divToRemove).remove();
    $("#tabs").tabs("refresh");
}

function selectRemoveElement(element) {
    element.hasClass("active") ? element.removeClass("active"): element.addClass("active");
}

function makeRemoveModal() {
    var listRoot = $('#remove-list-group'), numTab = 1;
    listRoot.html("");
    $("#tabs > ul").children('li').each(function() {
        if ($(this).attr("aria-labelledby") != "tab-add-tab") {
            listRoot.append("<li class=\"list-group-item\" data-tab=\"" + $(this).attr("aria-labelledby") + "\" data-div=\"" + $(this).attr("aria-controls") + 
                "\" onclick=\"selectRemoveElement($(this));\">Tab " + numTab + ": " + $(this).find("a").html() + "</li>");
            numTab++;
        }
    });
}

function removeTabs() {
    // Go through list of tabs, if active, remove it
    $("#remove-list-group").children('li').each(function() {
        if ($(this).hasClass("active")) {
            $('li[aria-labelledby="' + $(this).attr("data-tab") + "\"]").remove();
            $('#' + $(this).attr("data-div")).remove();
        }
    });
}