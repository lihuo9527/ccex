#!/bin/sh

cd dist && \
zip -r "ccex-web@$(date +"%Y-%m-%d_%H-%M-%S").zip" ccex-web/ && \
cd - && \
ng build --prod --build-optimizer && \
cp ./google268cc876982e4888.html dist/ccex-web/. && \
echo "Finished building ccex-web !!!"