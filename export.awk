#!/usr/bin/awk -f

# A program to export org-mode files to HTML

# Currently implemented:

# To Do:
# - emphasis
# - lists (unordered)

function footer() {
    print "<footer>"
    print "&copy; Johan Félisaz 2022. Generated using a custom AWK <a href=\"/export.awk\">script</a>"
    print "</footer>"
}

function css(href) {
    printf("<link rel=\"stylesheet\" href=\"%s\">", href);
}

# export a headline of level n, i.e. <h2>...</h2>
function hn(n, str) {
    printf("<h%d>%s</h%d>\n", n, str, n);
}

function navbar() {
    print "<header>"
    hn(1, "Johan Félisaz");
    
    print "<nav><ul>"
    print "<li><a href=\"/index.html\">Home</a></li>"
    print "<li><a href=\"/projects.html\">Projects</a></li>"
    print "<li><a href=\"/notes.html\">Notes</a></li>"
    print "<li><a href=\"/key.asc\">GPG</a></li>"
    print "</ul></nav>"
    
    print "</header>"
}

BEGIN {
    print "<!DOCTYPE html>"
    print "<html>"
    print "<head>"
    print "<meta charset=\"utf-8\">"
    print "<title>Johan Félisaz</title>"
    css("/global.css")
    css("/custom.css")
    print "<script src=\"https://polyfill.io/v3/polyfill.min.js?features=es6\"></script>"
    print "<script id=\"MathJax-script\" async src=\"https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js\"></script>"
    print "</head>"    
    print "<body>"
    navbar()

    close_par = 0; # set if a paragraph must be closed with </p>
    close_list = 0; # set if we are currently in a list
}

END {
    if (close_list) { print "</ul>"; close_par = 0; }
    if (close_par) print "</p>";
    
    footer()
    print "</body>"
    print "</html>"
}

# to_process is a boolean to make sure that lines that are processed
# in a special way (i.e. headlines) are not exported twice
{ to_process = 1 }

/^- / {
    if(!close_list) {
	close_list = 1;
	print "<ul>";
    }

    print "<li>"
    $0 = substr($0, 3)
}

/^$/ {
    if (close_list) {
	print "</ul>"
	close_list = 0
    }
    if (close_par) print "</p>";
    print "<p>";
    close_par = 1;
    to_process = 0;
}

/^#\+title: / {
    hn(2, substr($0, 10));
}

/^#\+/ { to_process = 0; } # skip for now

# headlines
/^\*+ / {
    hl = length($1);
    hn(hl+2, substr($0, hl+2));
    to_process = 0;
}

# remove the file: protocol if necessary
# change .org to .html in file extensions
function process_url(url) {
    if (url ~ /^file:/) url = substr(url, 6);
    if (url ~ /\.org$/) url = substr(url, 1, length(url) - 3) "html"
    return url;
}

# links
/\[\[/ {
    # no multiline support for now
    link_start = match($0, /\[\[/);
    link_sep = match($0, /\]\[/);
    link_end = match($0, /\]\]/);
    url = process_url(substr($0, link_start + 2, link_sep - link_start - 2));
    desc = substr($0, link_sep + 2, link_end - link_sep - 2);
    printf("%s<a href=\"%s\">%s</a>%s", substr($0, 1, link_start - 1), url, desc, "");
    
    to_process = 0;
}

to_process { print }

close_list { print "</li>" }
