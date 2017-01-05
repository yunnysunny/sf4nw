PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash
APP_PATH := .
APP_BOOT_SCRIPT := app.js
APP_NAME := sf4nw
now := $(shell date '+%Y%m%d%H%M%S')

#.RECIPEPREFIX +=

all: tag pull  run

tag:
	git tag bak_$(now)

install:
	cnpm install

pull:
	git pull origin $(branch)

set_env_vars:
	DISPLAY=:0

run:set_env_vars
	pm2 startOrReload $(APP_PATH)/$(APP_BOOT_SCRIPT) --name $(APP_NAME)

stop:
	pm2 stop $(APP_NAME)



.PHONY: install pull tag set_env_vars  run stop
