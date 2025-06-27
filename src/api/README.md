# Panel UI OpenAPI Definitions

```bash
brew install openjdk
export PATH="/opt/homebrew/opt/openjdk/bin:$PATH"
export CPPFLAGS="-I/opt/homebrew/opt/openjdk/include"

source ~/.zshrc  # or source ~/.bash_profile
java -version

wget https://fsb.generalresearch.com/openapi.json
openapi-generator-cli generate -i ./openapi.json -g typescript-axios -o ./
```