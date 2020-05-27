import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from "@angular/router";

export class SoftwareRouteReuseStrategy implements RouteReuseStrategy {

    private handlers: { [key: string]: DetachedRouteHandle } = {};

    constructor() { }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return true;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        switch (route.routeConfig.path) {
            case 'trn/lead/detail/:id': break;
            case 'trn/sales/detail/:id': break;
            case 'trn/support/detail/:id': break;
            case 'trn/lead/:startDate/:endDate/:status/:userId/:dashboard': break;
            case 'trn/sales/:startDate/:endDate/:status/:userId/:dashboard': break;
            case 'trn/support/:startDate/:endDate/:status/:userId/:dashboard': break;
            default: {
                this.handlers[route.routeConfig.path] = handle;
                break;
            }
        }
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return !!route.routeConfig && !!this.handlers[route.routeConfig.path];
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        if (!route.routeConfig) return null;
        return this.handlers[route.routeConfig.path];
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }
}