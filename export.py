#!/usr/bin/env python3
import os

for path in os.listdir():
    if len(path) > 4 and path[-4:] == '.org':
        html_path = path[:-3] + 'html'
        print(f'generating {html_path} ...')
        os.system(f'./export.awk {path} > {html_path}')

print('done. ')
