import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter,RouterLink } from '@angular/router';
import { Home } from './home';

describe('Home Component', () => {
  let fixture: ComponentFixture<Home>;
  let component: Home;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home], // standalone component
      providers: [
        provideRouter([]) // replaces RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  it('should render the workshop RouterLink directives', () => {
    const linkDes = fixture.debugElement.queryAll(By.directive(RouterLink));
    expect(linkDes.length).toBe(4);
  });
  it('should render the workshop navigation links', () => {
    const links = fixture.debugElement.queryAll(By.css('a'));
    expect(links.length).toBe(4);
  });

  it('should have correct routerLink values', () => {
   const linkDes = fixture.debugElement.queryAll(By.directive(RouterLink));
    const targets = linkDes.map(de => {
      // get the RouterLink directive instance attached to the element
      const dir = de.injector.get(RouterLink) as any;

      // newer router implementations put the input on different props:
      if (dir?.routerLink !== undefined) {
        const v = dir.routerLink;
        return Array.isArray(v) ? v.join('/') : String(v);
      }
      if (dir?.commands !== undefined) {
        const v = dir.commands;
        return Array.isArray(v) ? v.join('/') : String(v);
      }

      // fallback: parse the href attribute (safe fallback for tests)
      const href = de.nativeElement.getAttribute('href') || de.nativeElement.href || '';
      try {
        const url = new URL(href, 'http://localhost');
        return url.pathname.replace(/^\//, '');
      } catch {
        return href;
      }
    });

    expect(targets).toContain('products');
    expect(targets).toContain('add-product');
    expect(targets).toContain('update-product');
    expect(targets).toContain('chat');
  });

  it('should display correct link text', () => {
    const links = fixture.debugElement.queryAll(By.css('a'));
    const linkTexts = links.map(link => link.nativeElement.textContent.trim());
    expect(linkTexts).toContain('Products');
    expect(linkTexts).toContain('Add Product');
    expect(linkTexts).toContain('Update Product');
    expect(linkTexts).toContain('Chat');
  });
});
