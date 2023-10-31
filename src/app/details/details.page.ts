import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { isPlatform, IonContent, IonList } from '@ionic/angular';
import { Swiper } from 'swiper';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit, AfterViewInit {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;

  data: any = null;

  // mySwiper: any;
  activeCategory = 0;

  @ViewChildren(IonList, { read: ElementRef }) lists!: QueryList<ElementRef>;
  @ViewChild(IonContent) content!: IonContent;

  listElements: any = [];
  categorySlidesVisible = false;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    // this.mySwiper = new Swiper('.swiper-container', {
    //   slidesPerView: 2.6,
    //   freeMode: true,
    //   slidesOffsetBefore: 30,
    //   slidesOffsetAfter: 100,
    // });

    this.http
      .get('https://devdactic.fra1.digitaloceanspaces.com/foodui/1.json')
      .subscribe((res: any) => {
        this.data = res;
      });

    const headerHeight = isPlatform('ios') ? 44 : 56;
    this.document.documentElement.style.setProperty(
      '--header-position',
      `calc(env(safe-area-inset-top) + ${headerHeight}px)`
    );
  }

  ngAfterViewInit() {
    this.lists.changes.subscribe((_) => {
      this.listElements = this.lists.toArray();
    });
  }

  selectCategory(index: any) {
    const child = this.listElements[index].nativeElement;
    this.content.scrollToPoint(0, child.offsetTop - 120, 1000);
  }

  onScroll(ev: any) {
    const offset = ev.detail.scrollTop;

    this.categorySlidesVisible = offset > 500;

    for (let i = 0; i < this.listElements.length; i++) {
      const item = this.listElements[i].nativeElement;
      if (this.isElementInViewport(item)) {
        this.activeCategory = i;
        // this.slides.slideTo(i);
        break;
      }
    }
  }

  isElementInViewport(el: any) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
    );
  }
}
