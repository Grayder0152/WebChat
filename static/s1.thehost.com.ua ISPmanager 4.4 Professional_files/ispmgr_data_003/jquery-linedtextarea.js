/**
 * jQuery Lined Textarea Plugin 
 *   http://alan.blog-city.com/jquerylinedtextarea.htm
 *
 * Copyright (c) 2010 Alan Williamson
 * 
 * Version: 
 *    $Id: jquery-linedtextarea.js 464 2010-01-08 10:36:33Z alan $
 *
 * Released under the MIT License:
 *    http://www.opensource.org/licenses/mit-license.php
 * 
 * Usage:
 *   Displays a line number count column to the left of the textarea
 *   
 *   Class up your textarea with a given class, or target it directly
 *   with JQuery Selectors
 *   
 *   $(".lined").linedtextarea({
 *   	selectedLine: 10,
 *    selectedClass: 'lineselect'
 *   });
 *
 * History:
 *   - 2010.01.08: Fixed a Google Chrome layout problem
 *   - 2010.01.07: Refactored code for speed/readability; Fixed horizontal sizing
 *   - 2010.01.06: Initial Release
 *
 */
(function($) {

	$.fn.linedtextarea = function(options) {
		
		// Get the Options
		var opts = $.extend({}, $.fn.linedtextarea.defaults, options);
		
		
		/*
		 * Helper function to make sure the line numbers are always
		 * kept up to the current system
		 */
		var fillOutLines = function(codeLines, h, lineNo){
			var lineNos = "";
			while ( (codeLines.height() - h ) <= 0 ){
				for (var i = 0; i < 100; i++)
				{
					lineNos += lineNo + "<br/>";
					lineNo++;
				}
				codeLines.append(lineNos);
			}
			return lineNo;
		};
		
		
		/*
		 * Iterate through each of the elements are to be applied to
		 */
		return this.each(function() {
			var lineNo = 1;
			var textarea = $(this);
			var textarea_height = textarea.height();
			//textarea.attr("rows", "28");
			textarea.removeAttr("rows");
			textarea.height(textarea_height);
			
			/* Turn off the wrapping of as we don't want to screw up the line numbers */
			textarea.attr("wrap", "off");
			textarea.css({'resize':'none', 'float':'none'});
			var originalTextAreaWidth	= textarea.outerWidth();

			/* Wrap the text area in the elements we need */
			textarea.wrap("<div class='linedtextarea' style='height: " + textarea_height + "px'></div>");
			var linedTextAreaDiv	= textarea.parent().wrap("<div class='linedwrap' style='width:" + originalTextAreaWidth + "px; height: " + (textarea_height + 6) + "px'></div>");
			var linedWrapDiv 			= linedTextAreaDiv.parent();
			var td = linedWrapDiv.parent();
			
			if (navigator.userAgent.toLowerCase().indexOf('chrome/') != -1)
			{
				textarea.attr("rows", "28");
				linedWrapDiv.height(textarea_height + 6);
			}

			linedWrapDiv.prepend("<div class='lines' style='width:50px'></div>");
			
			var linesDiv	= linedWrapDiv.find(".lines");
			linesDiv.height( textarea_height + 6 );
			
			
			/* Draw the number bar; filling it out where necessary */
			linesDiv.append( "<div class='lineno codelines'></div>" );
			var codeLinesDiv	= linesDiv.find(".codelines");
			lineNo = fillOutLines( codeLinesDiv, linesDiv.height(), 1 );
			
			/* Set the width */
			var sidebarWidth		= linesDiv.outerWidth();
			var paddingHorizontal 		= parseInt( linedWrapDiv.css("border-left-width") ) + parseInt( linedWrapDiv.css("border-right-width") ) + parseInt( linedWrapDiv.css("padding-left") ) + parseInt( linedWrapDiv.css("padding-right") );
			var linedWrapDivNewWidth 	= td.width() - 8; //'100%';//originalTextAreaWidth - paddingHorizontal;
			var textareaNewWidth		= originalTextAreaWidth - sidebarWidth - paddingHorizontal - 11;

			textarea.width( textareaNewWidth );
			linedWrapDiv.width( linedWrapDivNewWidth );

			td.resize(function() {
				var width = $(this).width();
				linedWrapDiv.width(width - 8);
				textarea.width(width - sidebarWidth - paddingHorizontal - 11);
			});

			textarea.keydown(function(event) { return checkTab(event); });
			textarea.change(function() { file_was_changed = true; });

			
			/* React to the scroll event */
			textarea.scroll( function(tn){
				var domTextArea		= $(this)[0];
				var scrollTop 		= domTextArea.scrollTop;
				var clientHeight 	= domTextArea.clientHeight;
				codeLinesDiv.css( {'margin-top': (-1*scrollTop) + "px"} );
				lineNo = fillOutLines( codeLinesDiv, scrollTop + clientHeight, lineNo );
			});
		});
	};

  // default options
  $.fn.linedtextarea.defaults = {
  	selectedLine: -1,
  	selectedClass: 'lineselect'
  };
})(jQuery);


function checkTab(e)
{
	file_was_changed = true;

	var t = e.target;
	var ss = t.selectionStart;
	var se = t.selectionEnd;

	var c = e.keyCode || e.which;
	// Tab key - insert tab expansion
	if (c == 9)
	{
		e.preventDefault();
		var tval = t.value;
		var saveScroll = t.scrollTop;

		if (e.shiftKey)
		{
			// Special case of multi line selection
			if (ss != se && tval.slice(ss, se).indexOf("\n") != -1)
			{
				// In case selection was not of entire lines (e.g. selection begins in the middle of a line)
				// we ought to tab at the beginning as well as at the start of every following line.
				if (ss != 0)
					ss = tval.slice(0, ss).lastIndexOf("\n", ss - 1) + 1;
        
				var pre = tval.slice(0, ss);
				var oldlen = tval.length;
				var sel = tval.slice(ss + (tval[ss] == "\t" ? 1 : 0), se).replace(/\n\t/g, "\n");
				var post = tval.slice(se, tval.length);
				t.value = pre.concat(sel).concat(post);
                        
				t.selectionStart = ss;
				t.selectionEnd = se + t.value.length - oldlen;
			}
        
			// "Normal" case (no selection or selection on one line only)
			else if (ss == se)
			{
				if (ss != 0)
					ss = tval.slice(0, ss).lastIndexOf("\n", ss - 1) + 1;
				if (tval[ss] == "\t")
				{
					t.value = tval.slice(0, ss).concat(tval.slice(ss + 1, tval.length));
					t.selectionStart = t.selectionEnd = se - 1;
				}
			}
		}
		else
		{
			// Special case of multi line selection
			if (ss != se && tval.slice(ss, se).indexOf("\n") != -1)
			{
				// In case selection was not of entire lines (e.g. selection begins in the middle of a line)
				// we ought to tab at the beginning as well as at the start of every following line.
				if (ss != 0)
					ss = tval.slice(0, ss).lastIndexOf("\n", ss - 1) + 1;
        
				var pre = tval.slice(0, ss);
				var oldlen = tval.length;
				var sel = tval.slice(ss, se).replace(/\n/g, "\n\t");
				var post = tval.slice(se, tval.length);
				t.value = pre.concat("\t").concat(sel).concat(post);
                        
				t.selectionStart = ss;
				t.selectionEnd = se + t.value.length - oldlen;
			}
        
			// "Normal" case (no selection or selection on one line only)
			else
			{
				t.value = tval.slice(0, ss).concat("\t").concat(tval.slice(ss, tval.length));
				if (ss == se)
					t.selectionStart = t.selectionEnd = ss + 1;
				else
				{
					t.selectionStart = ss + 1;
					t.selectionEnd = se + 1;
				}
			}
		}
		t.scrollTop = saveScroll;

		return false;
	}
}
