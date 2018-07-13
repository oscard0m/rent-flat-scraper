INIT_TASKS:=		create-precommit dependency-install

.DEFAULT_GOAL:=		install

######################
#       GOALS        #
######################
install: $(INIT_TASKS) ## build all the tasks to build and test all the code

create-precommit:
	@cp ./precommits/pre-commit .git/hooks/pre-commit

dependency-install:
	@echo -e "\033[0;33m>>> >>> >>> \033[0;30;46m Install dependecies \033[0m"
	npm i

