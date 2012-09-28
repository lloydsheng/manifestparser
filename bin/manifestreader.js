#!/usr/bin/env node

var // Dependencies
	ApkReader = require('../lib/apkmanifestreader'),
	IpaReader = require('../lib/ipamanifestreader'),
	fs = require('fs'), 
	// Parse cli arguments
	argv = require('optimist')
	.usage("Extract manifest from android binary file.\n Usage: $0")
	.string('output-format', ['xml', 'json'])
	.string('output-target')
	.default('output-format', 'xml')
	.default('output-target', 'event')
	.demand('target')
	.demand('output-target')
	.describe('target', 'Filename to read manifest from')
	.describe('output-format', 'Manifest output format (xml|json)')
	.describe('output-target', 'Output via event or stdout')
	.argv,	
	// Manifest output format
	outputFormat = argv['output-format'],
	// Manifest output to file
	outputTarget = argv['output-target'] ?  argv['output-target'] : 'stdout', 
	// Path to target
	target = argv['target'],
	// Type of file to parse
	targetType = target.length >= 3 ? target.substr(-3).toLowerCase() : null;
	
// Always default to xml
if(outputFormat !== 'json') outputFormat = 'xml';

// Check if valid file type
if(targetType !== 'apk' && targetType !== 'ipa') {
	console.log("Invalid binary format for filename " + target + ". Supported formats are: .apk, .ipa.");
	process.exit(1);
}

// Parse actual apk manifest
new ApkReader(target, {
	outputFormat: outputFormat,
	outputTarget: outputTarget 
}).on('manifest', function(manifest) {
 	process.stdout.write(manifest);
}).on('error', function(err) {
	process.stdout.write(err);
});