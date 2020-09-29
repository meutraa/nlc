var results = [], sresults = [], elements = [];
var ids = [ "fish", "bugs", "dscs", "rain", "dry", "island", "mainland", "caught", "uncaught", "hour", "month", "search" ];
var checkboxes = 9;

function inrange(range, value, mod)
{
    var length = range.length;
    if(length == 1) return true;
    if(length > 2) return (range.indexOf(value) != -1);
    var high = range[1];
    if(high < range[0]) high += mod;
    return (value >= range[0] && value <= high);
}

function search(text)
{
    sresults.length = 0;
    for(var i = 0; i < results.length; i++)
        if(collectables[results[i]].name.indexOf(text) != -1)
            sresults.push(results[i]);
}

function applyFilter()
{
    results.length = 0;
    for(var i = 0; i < collectables.length; i++)
    {
        var c = collectables[i];
        if(((elements[3].checked == 1 && 1 == c.rain) || (elements[4].checked == 1 && 0 == c.rain)) &&
            ((elements[7].checked == 1 && 1 == c.have) || (elements[8].checked == 1 && 0 == c.have)) &&
            ((elements[0].checked == 1 && c.type == 0) || (elements[1].checked == 1 && c.type == 1) || (elements[2].checked == 1 && c.type == 2)) &&
            ((elements[6].checked == 1 && 1 == c.main == 1) || (elements[5].checked == 1 && 1 == c.island == 1)))
        {
            var hour = elements[9].value, month = elements[10].value;
            if ((c.island == 1 && elements[5].checked == 1) || (hour == 24 && month == 12) ||
                (month == 12 && inrange(c.hours, hour, 24)) ||
                (hour == 24 && inrange(c.months, month, 12)) ||
                (inrange(c.hours, hour, 24) && inrange(c.months, month, 12)))
            {
                results.push(c.id);
            }
        }
    }
}

function create_save()
{
    var save = "";
    for(var i = 0; i < collectables.length; i++) save += collectables[i].have;
    return save;
}

function load_save(save)
{
    for(var i = 0; i < collectables.length; i++) collectables[i].have = (save.charAt(i) == '1') ? 1 : 0;
}

function set_have(id, have)
{
    collectables[id].have = (have == true) ? 1 : 0;
    var d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000));
    document.cookie = "save=" + create_save() + "; expires=" + d.toUTCString();
    updateResults();
}

var m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec", "All Months"];
var h = ["Midnight", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am",
             "Midday", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm", "All Hours"];

function setTime()
{
    var d = new Date();
    elements[9].value = d.getHours();
    elements[10].value = d.getMonth();
    setText("monthText", m[elements[10].value]);
    setText("hourText", h[elements[9].value]);
    updateResults();
}

function three(a, b, c) {
    if(!a.checked && (!b.checked || !c.checked)) {
        b.disabled = b.checked;
        c.disabled = c.checked;
    } else {
        b.disabled = false;
        c.disabled = false;
    }
    updateResults();
}

function two(a, b) {
    if(!a.checked) b.disabled = true;
    else b.disabled = false;
    updateResults();
}

function setText(elementId, value) {
    document.getElementById(elementId).innerHTML = value;
}

function resetEl(update)
{
    for(var i = 0; i < checkboxes; i++)
    {
        elements[i].checked = true;
        elements[i].disabled = false;
    }
    elements[9].value = 24;
    elements[10].value = 12;
    if(update) updateResults();
    setText("monthText", m[12]);
    setText("hourText", h[24]);
}

function onLoaded()
{
    for(var i = 0; i < ids.length; i++) {
        elements.push(document.getElementById(ids[i]));
    }
    resetEl()
    if(document.cookie.indexOf("save=") != -1) {
        load_save((document.cookie.split("="))[1]);
    }
    applyFilter();
    populateTable();
}

function populateTable() {
    var table = document.getElementById("table");
    for(var i = 0; i < collectables.length; i++)
    {
        var c = collectables[i];
        var check  = document.createElement("input");
        check.type = "checkbox";
        check.id = c.id;
        check.checked = c.have == 1;
        check.onclick = function(){set_have(this.id, this.checked);};
        var hs = "all", ms = "all";
        if(c.hours.length == 2) hs = h[c.hours[0]] + " - " + h[(c.hours[1] + 1)];
        else if(c.hours.length > 2) hs = c.hourString;
        if(c.months.length == 2) ms = m[c.months[0]] + " - " + m[c.months[1]];
        else if(c.name == "salmon" || c.name == "king salmon") ms = m[8];
        else if(c.months.length > 2) ms = c.monthString;

        var row = table.insertRow(-1);
        row.insertCell(-1).appendChild(check);
        row.insertCell(-1).innerHTML = c.name;
        row.insertCell(-1).innerHTML = locations[c.loc];
        row.insertCell(-1).innerHTML = hs;
        row.insertCell(-1).innerHTML = ms;
        row.insertCell(-1).innerHTML = c.price;
        row.insertCell(-1).innerHTML = sizes[c.size];
    }
}

function updateResults()
{
    applyFilter();
    var table = document.getElementById("table");

    var collection = (elements[11].value.length == 0) ? results : sresults;
    for(var i = 1, j = 0; i < collectables.length + 1; i++)
    {
        var row = table.rows[i];
        var hide = collection.indexOf(i - 1) == -1;
        row.style.visibility = hide ? "collapse" : "visible";
        row.style.display = hide ? "none" : "table-row";
        if(!hide) {
            row.style.backgroundColor = (j++ % 2) == 1 ? "#fff" : "#eee";
        }
    }
}
