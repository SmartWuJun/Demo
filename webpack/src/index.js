// import txt from './reademe.txt';


// let msg='hello world';

// document.write(txt+msg)


const parentStyle = `
  background: #fdc;
  width: 1200px;
  height: 600px;
  box-sizing: border-box;
  padding: 150px 300px;
`
const childStyle = `
  background: #cdf;
  width: 600px;
  height: 300px;
`
const parent = document.getElementById('parent')
const child = document.getElementById('child')
parent.style.cssText = parentStyle
child.style.cssText = childStyle