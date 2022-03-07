#!/usr/bin/awk -f

# A program to export org-mode files to HTML

# Currently implemented:

# To Do:
# - links
# - emphasis
# - better CSS

function footer() {
    print "<footer>"
    print "&copy; Johan Félisaz 2022. Generated using a custom AWK script"
    print "</footer>"
}

function css(href) {
    printf("<link rel=\"stylesheet\" href=\"%s\">", href);
}

BEGIN {
    print "<!DOCTYPE html>"
    print "<html>"
    print "<head>"
    print "<title>Johan Félisaz</title>"
    css("global.css")
    css("custom.css")
    print "<script src=\"https://polyfill.io/v3/polyfill.min.js?features=es6\"></script>"
    print "<script id=\"MathJax-script\" async src=\"https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js\"></script>"
    print "</head>"
}

END {
    footer()
    print "</html>"
}

# export a headline of level n, i.e. <h2>...</h2>
function hn(n, str) {
    printf("<h%d>%s</h%d>\n", n, str, n);
}

# to_process is a boolean to make sure that lines that are processed
# in a special way (i.e. headlines) are not exported twice
{ to_process = 1; }

/^#\+title: / {
    hn(1, substr($0, 10));
}

/^#\+/ { to_process = 0; } # skip for now

/^\*+ / {
    hl = length($1);
    hn(hl+1, substr($0, hl+2));
    to_process = 0;
}

to_process { print }
