#DISPLAY=:0 && nohup node app.js --appname=sf4nw > nohup.out 2>&1  &

APP_PATH=.
APP_BOOT_SCRIPT=app.js
APP_NAME=sf4nw
runInBack=1
killProcess=0
envType=0
while [ $# -gt 0 ]; do
    case $1 in
    -c|-console)
	    runInBack=0;
         shift
         ;;
    -q|-quit)
	    killProcess=1
         shift
         ;;
    -t|-type)
          shift
          envType=$1
          shift
          ;;
      --)
         shift
         echo "case --"  #非法参数
         break
    esac
done
cmd='DISPLAY=:0 && '
if [ $killProcess -eq 1 ] ; then
    cmd="ps -ef | awk '/$APP_NAME/{print \$2}' | xargs kill";
else
    cd $APP_PATH
    cmd='node $APP_PATH/$APP_BOOT_SCRIPT --app=$APP_NAME';

    if [ $envType -ne 0 ] ; then
        cmd="export TYPE=$envType && $cmd"
    fi

    if [ $runInBack -eq 1 ] ; then
    	cmd="nohup $cmd &"
    else
        cmd="$cmd"
    fi
fi

if [ $killProcess -ne 1 ] ; then
	now=`date '+%Y-%m-%d%H:%M:%S'`

	mv nohup.out $now.bak.nohup.out
	echo "==============start at $now=============="
	echo "==============start at $now==============" >> nohup.out
fi
#rm -rf nohup.out
echo $cmd
eval $cmd
