#!/usr/bin/env python3

# USAGE: make_gradient.py color1 color2 color3
# OR: make_gradient.py -p $(echo "extraneous #anactualcolor irrelevant notacolor #yesacolor")

import sys

prune = False
if sys.argv[1] == "-p":
	prune = True
	sys.argv.pop(1)

stops = sys.argv[1:]
if prune:
	stops = [stop for stop in stops if stop[0] == "#"]

for prefix in ["", "-webkit-"]:
	print("background-image: " + prefix + "gradient(linear, left top, right top", end="")
	for i, stop in enumerate(stops):
		print(", color-stop("
		, "{:.2f}".format((i + 0.) / (len(stops) - 1))
		, ", "
		, "#"
		, stop.strip("#")
		, ")"
		, sep="", end="")
	print(");")

