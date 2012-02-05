(function($) {  
    $.fn.assessment = new function() {
        
        var _this, _params, _wrapper, _form, _status, _response;
        
        var _defaults = {

            ids:{
                fieldsWrapper:"asQuestionsSet",
                status:"status",
                status:"response",
                form:"asForm"
            },
            styles:{
                question:"question",
                questionTitle:"",
                questionCount:"",
                questionText:"",
                answer:"",
                answerOption:"",
                answerRadio:""
            },
            questions:null,
            answers:null,
            action:"",
            
            nextButton:"",
            backButton:"",
            submitButton:""
            
        }
       
        // All these are static members now. This has to be made dynamic. 
       
        var assessment = function(params){
           
            if(this.prop("tagName") !="DIV"){
                if(console && console.log){
                    console.log("Please add to div element");
                }    
                return this;
            }

            if(typeof(params) != "object"){
                params = {};
            }

            params = $.extend(true, _defaults, params );  
            
            _this   = this;
            _params = params;

            _wrapper = $('<div></div>').attr('id', _params.ids.fieldsWrapper).addClass(_params.styles.fieldsWrapper).appendTo(this);
            _status = $('<h5></h5>').attr('id', _params.ids.status).addClass(_params.styles.status).appendTo(_wrapper);
            _form = $('<form></form>').attr({id:_params.ids.form, method:"post", action:_params.action}).addClass(_params.styles.form).appendTo(_wrapper);
            _response = $('<p></p>').attr('id', _params.ids.response).appendTo(_wrapper);
            
            
            if(_params.questions){
                assessment.setQuestions({questions:_params.questions, answers:_params.answers});
            }
            
            
            if(_params.wizard){
                
                if(!$.fn.formwizard){
                    if(console && console.log){
                        console.log("Please add jQuery wizard plug-in");
                    }    
                    return this;         
                }
                
                _form.formwizard({ 
				 	validationEnabled: true,
				 	focusFirstInput : true,
				 }
				);
				
				$(_params.nextButton).click(
				    function(e){
				         var state = _form.formwizard("state");				         
				         if(_form.formwizard("next") && state.isLastStep){
				            _form.submit();		
				         }
                         
                    }	
				);
				
				$(_params.backButton).click(
				    function(e){
						_form.formwizard("back");
					}	
				);
                
                
            }else{
               _form.validate();
               $(_params.submitButton).click(
                     function(e){
                         if(_form.valid()){
                                //_form.validate().focusInvalid();
                                _form.submit();
                                return false;
                         }
				    }	
				);                
            }
            
            return this;
            
        }
        
        
        assessment.setQuestions = function(qset){
           var _xthis = this;
           if(qset.questions && qset.questions.length){
                $.each(qset.questions, function(i, q){
                    
                    if(qset.answers){

            		    var ansOptions;

            		    if(qset.answers.length){
            		        ansOptions = qset.answers[i];     		        
            		    }else{
            		        ansOptions = qset.answers;     
            		    }

            		    if(ansOptions){
            		        addQuestion(q, ansOptions);
            		    }

            		}
            
                });
                
            }
           
        }
        
        
        assessment.addQuestion = function(q, a){
            
            if(!a && _params.answers && !(_params.answers.hasOwnProperty("length"))){
                a = _params.answers;
            }else if(!a && (_params.answers.hasOwnProperty("length"))){
                return;
            }else if(a && !(_params.answers.hasOwnProperty("length"))){
                return;
            }else if(a && _params.answers.hasOwnProperty("length")){
                if(!_params.answers){
                    _params.answers = [];
                }
                _params.answers.push(a);
            }else{
                return;
            }
            
            if(!_params.questions){
                _params.questions = [];
            }
            _params.questions.push(q);
        
            addQuestion(q, a);
        
        }
        
        addQuestion = function(q, a){
            
            var total = _form.find("fieldset").size();
                       
            var field = $('<fieldset></fieldset>').attr("id", "question" + (total+1)).addClass(_params.styles.question).appendTo(_form);
            $('<h3></h3>').addClass(_params.styles.questionTitle).appendTo(field).html(q.title);
            $('<h4></h4>').addClass(_params.styles.questionCount).appendTo(field);
    		$('<p></p>').addClass(_params.styles.questionText).appendTo(field).html(q.text);
    		
    		$.each(a, function(k, option){
	             var rid = q.id + "_" + k;
                 var optionDIV = $('<div></div>').addClass(_params.styles.answerOption).appendTo(field);
                 $('<input type="radio"></input>').attr({id:rid, name:q.id, value:k}).addClass(_params.styles.answerRadio).appendTo(optionDIV);
                 $('<label></label>').attr({"for":rid}).html(option).appendTo(optionDIV);
		    });
		    
		    _wrapper.find("fieldset h4").each(
		        function(i, item){
		            $(this).html((i+1) + " out of " + (total+1));
		        }
		    );
		
		}
        
        return assessment;
        
    };  
})(jQuery);
