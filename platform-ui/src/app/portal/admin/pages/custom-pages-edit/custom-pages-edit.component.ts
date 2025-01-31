import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TuiButton, TuiIcon, TuiLabel, TuiTextfield } from '@taiga-ui/core';
import { TuiTooltip } from '@taiga-ui/kit';
import {
  TUI_DEFAULT_INPUT_COLORS,
  TuiInputColorModule,
  TuiSelectModule,
} from '@taiga-ui/legacy';
import { QuillModule } from 'ngx-quill';
import { UICustomPage } from '../../../community/models/UICustomPage';
import { CUSTOM_PAGES_SERVICE_TOKEN } from '../../admin.providers';
import { CustomPagesService } from '../../services/custom-pages.service';
@Component({
  selector: 'app-custom-pages-edit',
  imports: [
    QuillModule,
    TuiInputColorModule,
    TuiTextfield,
    TuiLabel,
    FormsModule,
    ReactiveFormsModule,
    TuiIcon,
    TuiButton,
    TuiTooltip,
    TuiSelectModule,
    TranslateModule
  ],
  templateUrl: './custom-pages-edit.component.html',
  styleUrl: './custom-pages-edit.component.scss'
})
export class CustomPagesEditComponent {
  pageForm: FormGroup;
  pageId: string | null = null;
  protected readonly palette = TUI_DEFAULT_INPUT_COLORS;

  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // Text formatting
      [{ header: 1 }, { header: 2 }], // Headers
      [{ list: 'ordered' }, { list: 'bullet' }], // Lists
      [{ indent: '-1' }, { indent: '+1' }], // Indentation
      [{ align: [] }], // Text alignment
      ['link', 'image'], // Links and images
      ['clean'], // Remove formatting
    ],
  };
  page: UICustomPage = {} as UICustomPage;

  protected items = [
    'footer-links',
    'copyright',
    'footer-help',
  ];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    @Inject(CUSTOM_PAGES_SERVICE_TOKEN)
    private customPagesService: CustomPagesService,
    private router: Router,
  ) {
    this.pageForm = this.fb.group({
      ref: ['', Validators.required],
      position: ['', Validators.required],
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.pageId = this.route.snapshot.paramMap.get('id');
    if (this.pageId) {
      this.customPagesService
        .getCustomPage(this.pageId)
        .subscribe((page) => {
          this.page = page;
          this.pageForm.patchValue(this.page);
        });
    } else {
      this.pageForm.patchValue(this.page);
    }
  }

  onSubmit() {
    if (this.pageForm.valid) {
      const newPage: UICustomPage = this.pageForm.value;
      if (this.pageId) {
        this.customPagesService.updateCustomPage(newPage);
      } else {
        this.customPagesService.createCustomPage(newPage);
      }
      this.router.navigate(['/admin/pages']);
    }
  }
}
