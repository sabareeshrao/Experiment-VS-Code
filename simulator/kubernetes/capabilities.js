(()=>{"use strict";
const groups={
shell:["headlamp-shell","cluster-selector","namespace-selector","global-search","command-palette","dark-mode","resource-counts"],
clusters:["multi-cluster","context-switching","cluster-overview","cluster-health"],
workloads:["pods","deployments","replicasets","statefulsets","daemonsets","jobs","cronjobs","hpa","rollouts","scale"],
pod:["pod-detail","containers","conditions","labels","annotations","events","logs","previous-logs","exec"],
network:["services","endpoints","ingresses","network-policies"],
storage:["persistent-volumes","persistent-volume-claims","storage-classes"],
configuration:["configmaps","secrets","service-accounts"],
nodes:["node-list","node-detail","capacity","allocatable","conditions","taints","cordon","drain"],
rbac:["roles","clusterroles","rolebindings","clusterrolebindings","auth-can-i"],
yaml:["resource-yaml","edit-yaml","create-from-yaml","apply-yaml","validation"],
observability:["events","metrics","pod-metrics","node-metrics","resource-status"],
views:["map-view","projects","project-resource-grouping"],
extensions:["crds","custom-resources","plugins","settings"],
terminal:["kubectl-terminal","contexts","get","describe","logs","exec","port-forward","apply","delete","scale","rollout","top","events","json-yaml-output","jsonpath","auth","api-discovery","explain"]
};
const actions=[
"selectCluster","selectNamespace","openOverview","openResourceList","selectResource","openResourceTab","openLogs","selectContainer","searchLogs","openExec","runExecCommand","openTerminal","runKubectl","clearTerminal","openYaml","editYaml","applyYaml","createResource","deleteResource","scaleDeployment","restartDeployment","rolloutUndo","openMapView","openProjects","openProject","openMetrics","openEvents","filterEvents","openSettings","openPlugins","searchResources","toggleTheme","cordonNode","uncordonNode","drainNode","suspendCronJob","runCronJob","editConfigMap","openCommandPalette","showToast"
];
window.KUBERNETES_CAPABILITIES={version:1,targetFidelity:91,software:"Kubernetes / Headlamp + kubectl",groups,actions,registerFeature(g,n){groups[g]||(groups[g]=[]);if(!groups[g].includes(n))groups[g].push(n)},registerAction(n){if(!actions.includes(n))actions.push(n)},hasFeature(n){return Object.values(groups).some(x=>x.includes(n))},snapshot(){return JSON.parse(JSON.stringify({version:this.version,targetFidelity:this.targetFidelity,groups,actions}))}}})();