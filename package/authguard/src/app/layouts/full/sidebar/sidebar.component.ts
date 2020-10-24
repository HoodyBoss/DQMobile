import {
    ChangeDetectorRef,
    Component,
    NgZone,
    OnDestroy,
    ViewChild,
    HostListener,
    Directive,
    AfterViewInit
} from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MediaMatcher } from '@angular/cdk/layout';


import { MenuItems } from '../../../shared/menu-items/menu-items';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: []
})
export class AppSidebarComponent implements OnDestroy {
    public config: PerfectScrollbarConfigInterface = {};
    mobileQuery: MediaQueryList;

    private _mobileQueryListener: () => void;
    status: boolean = true;

    itemSelect: number[] = []
    parentIndex: Number;
    childIndex: Number;

    setClickedRow(i, j) {
        this.parentIndex = i;
        this.childIndex = j;
    }
    subclickEvent() {
        this.status = true;
    }
    scrollToTop() {
        document.querySelector('.page-wrapper').scroll({
            top: 0,
            left: 0
        });
    }

    constructor(
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        public menuItems: MenuItems
    ) {
        this.mobileQuery = media.matchMedia('(min-width: 768px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }
}
