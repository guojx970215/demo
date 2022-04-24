let nextUnitOfWork = null;
let rootFiber = null;
import { renderDom } from './react-dom';
// 创建 rootFiber 作为首个 nextUnitOfWork
export function createRoot (element, container) {
  rootFiber = {
    stateNode: container, // 记录对应的真实 dom 节点
    element: {
      // 挂载 element
      props: { children: [element] },
    },
  };
  nextUnitOfWork = rootFiber;
}
function performUnitOfWork (workInProgress) {
  if (!workInProgress.stateNode) {
    // 若当前 fiber 没有 stateNode，则根据 fiber 挂载的 element 的属性创建
    workInProgress.stateNode = renderDom(workInProgress.element);
  }
  if (workInProgress.return && workInProgress.stateNode) {
    // 如果 fiber 有父 fiber且有 dom
    // 向上寻找能挂载 dom 的节点进行 dom 挂载
    let parentFiber = workInProgress.return;
    while (!parentFiber.stateNode) {
      parentFiber = parentFiber.return;
    }
    parentFiber.stateNode.appendChild(workInProgress.stateNode);
  }
}