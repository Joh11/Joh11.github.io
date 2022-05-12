#!/usr/bin/env python3
import os

# use python3 -m http.server to try it locally

root_paths=['', 'misc/']

for root in root_paths:
    for path in os.listdir(None if root == '' else root):
        if len(path) > 4 and path[-4:] == '.org':
            html_path = root + path[:-3] + 'html'
            print(f'generating {html_path} ...')
            os.system(f'./export.awk {root+path} > {html_path}')

print('done. ')
