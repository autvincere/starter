starter
=======

HTML, SASS, JS starter kit running on Gulp.

## ToDo's
- review TITOOLBOX.isMobile() (we could find a more bulletproof solution)
- add commonly used mixins (transitions)
- add SCSS lint
- add jshint

## Requirements
 - Node
 - Ruby
 - Bundler
 - Gulp
 - bower

## Installation
- npm install
- bundle install

## Configuration
- gulpfile
	- update options.browserSync to match your needs (all infos are in there)
- sass
	- _mixins.scss
		- Pick your mediaquery solution: comment out the one you don't need
	- _variables.scss
		- If you need Susy grid - take the time to set it up correctly

# Usage
- gulp serve 				-> build for dev
- gulp 						-> build for prod
- gulp serve:dist 			-> build and serve the output from the dist build