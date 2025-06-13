import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesExtractorComponent } from './rules-extractor.component';

describe('RulesExtractorComponent', () => {
  let component: RulesExtractorComponent;
  let fixture: ComponentFixture<RulesExtractorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesExtractorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesExtractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
