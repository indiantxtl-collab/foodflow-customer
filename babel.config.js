customer_babel = '''module.exports = {
presets: ['module:metro-react-native-babel-preset'],
plugins: [
'react-native-reanimated/plugin',
[
'module-resolver',
{
root: ['./src'],
extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
alias: {
'@': './src',
},
},
],
],
};
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/babel.config.js", "w") as f:
f.write(customer_babel)
