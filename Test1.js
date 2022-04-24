// 简答题
/**
 * 1.讲一下执行上下文
 * 答:
 */

/**
 * 2.讲一下闭包
 * 答:
 */

/**
 * 3.讲一下事件循环
 * 答:
 */


// 手写包括（快排，选择，插入，冒泡，call，bind，apply，instanceof，去重，promise所有，async和await，对象合并，深拷贝，防抖，节流，二叉树前中后遍历递归，二叉树前中后迭代遍历，isEqual，平衡二叉树，对称二叉树）20道手写。
let array = [1, 2, 1, 21, 12, 1, 3, 41241, 41, 2312, 123, 213, 12, -132, 3, -123, -123445]
let arr2 = '20 144 933 237 206 2 83 141 349 349 1 3 76 104 111 102 94 112 65 417 133 215 347 23 21 374 226 100 101 70 198 455 122 46 78'
let array1 = arr2.split(' ')
array1 = array1.map((item, index) => {
  return Number(item)
})
/**
 * 快排
 * @param {*} params 
 */
function Test1 (arr) {
  if (arr && arr.length <= 1) {
    return arr
  }
  let left = []
  let right = []
  let quickIndex = Math.floor(arr.length / 2)
  let quickValue = arr.splice(quickIndex, 1)[0]
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    if (element < quickValue) {
      right.push(element)
    } else {
      left.push(element)
    }
  }
  return Test1(right).concat(quickValue).concat(Test1(left))
}

console.log(Test1(array1), Test1(array1).length)
/**
 * 选择
 * @param {*} params 
 */
function Test2 (params) {

}
console.log(Test2())
/**
 * 插入
 * @param {*} params 
 */
function Test3 (params) {

}
console.log(Test3())
/**
 * 冒泡
 * @param {*} params 
 */
function Test4 (array) {

}
console.log(Test4())
/**
 * call
 * @param {*} params 
 */
function Test5 (params) {

}
console.log(Test5())
/**
 * bind
 * @param {*} params 
 */
function Test6 (params) {

}
console.log(Test6())
/**
 * apply
 * @param {*} params 
 */
function Test7 (params) {

}
console.log(Test7())
/**
 * instanceof
 * @param {*} params 
 */
function Test8 (params) {

}
/**
 * 去重
 * @param {*} params 
 */
function Test9 (params) {

}
/**
 * promise/all/race
 * @param {*} params 
 */
function Test10 (params) {

}
/**
 * async/await
 * @param {*} params 
 */
function Test11 (params) {

}
/**
 * 对象合并
 * @param {*} params 
 */
function Test12 (params) {

}
/**
 * 深拷贝
 * @param {*} params 
 */
function Test13 (params) {

}
/**
 * 防抖
 * @param {*} params 
 */
function Test14 (params) {

}
/**
 * 节流
 * @param {*} params 
 */
function Test15 (params) {

}
/**
 * 二叉树前序遍历递归
 * @param {*} params 
 */
function Test16 (params) {

}
/**
 * 二叉树前序遍历迭代
 * @param {*} params 
 */
function Test17 (params) {

}
/**
 * 二叉树中序遍历递归
 * @param {*} params 
 */
function Test18 (params) {

}
/**
 * 二叉树中序遍历迭代
 * @param {*} params 
 */
function Test19 (params) {

}
/**
 * 二叉树后序遍历递归
 * @param {*} params 
 */
function Test20 (params) {

}
/**
 * 二叉树后序遍历迭代
 * @param {*} params 
 */
function Test21 (params) {

}
/**
 * isEqual
 * @param {*} params 
 */
function Test22 (params) {

}
console.log(Test22())
/**
 * 平衡二叉树
 * @param {*} params 
 */
function Test23 (params) {

}
console.log(Test23())
/**
 * 对称二叉树
 * @param {*} params 
 */
function Test24 (object) {

}
console.log(Test24())
/**
 * reduce
 * @param {*} params 
 */
function Test25 (array) {

}
console.log(Test25(array))
/**
 * trim
 * @param {*} params 
 */
function Test26 (str) {

}
console.log(Test26())
/**
 * flat
 * @param {*} params 
 */
function Test27 (array) {

}
console.log(Test27())
/**------------分割线------------ */
/**----------------------力扣算法必刷------------------------ */
/**
 * 用两个栈实现一个队列
 * @param {*} params 
 */
function Test28 (params) {

}
console.log(Test28())

/**
 * 
 * 输入：n = 3
 * 输出：["((()))","(()())","(())()","()(())","()()()"]
 * @param {*} params 
 */
function Test29 (params) {

}
/**
 * 括号生产
 * 输入：n = 3
 * 输出：["((()))","(()())","(())()","()(())","()()()"]
 * @param {*} params 
 */
function Test29 (params) {

}
console.log(Test29())

