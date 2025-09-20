import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedService } from '../../services/shared.service';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Genre } from '../../models/game.model';
import { RawgService } from '../../services/rawg.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-side-bar',
  imports: [MatIconModule, MatTooltipModule, MatCheckboxModule, MatButton, ReactiveFormsModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  extended: boolean = false;
  filterForm: FormGroup;
  genres: Genre[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private sharedService: SharedService,
    private rawgService: RawgService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      releaseDateBegin: [''],
      releaseDateEnd: [''],
      genres: this.fb.array<FormControl<boolean | null>>([]),
    });
  }

  ngOnInit(): void {
    this.loadGenres();
  }

  loadGenres(): void {
    this.loading = true;
    this.error = null;
    this.rawgService.getGenres().subscribe({
      next: (genres) => {
        this.genres = genres;
        const genreControls = genres.map(() => new FormControl<boolean | null>(false));
        this.filterForm.setControl('genres', this.fb.array<FormControl<boolean | null>>(genreControls));
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  get genresArray(): FormArray<FormControl<boolean | null>> {
    return this.filterForm.get('genres') as FormArray<FormControl<boolean | null>>;
  }

  onFilterBtnClick(): void {
    const selectedGenres = this.genres
      .filter((_, index) => this.genresArray.at(index).value)
      .map((genre) => genre.slug);
    const filters = [];
    if (selectedGenres.length > 0) {
      filters.push(`genres=${selectedGenres.join(',')}`);
    }
    const search = this.filterForm.get('search')?.value;
    if (search) {
      filters.push(`search=${encodeURIComponent(search)}`);
    }
    const releaseDateBegin = this.filterForm.get('releaseDateBegin')?.value;
    const releaseDateEnd = this.filterForm.get('releaseDateEnd')?.value;
    if (releaseDateBegin && releaseDateEnd) {
      filters.push(`dates=${releaseDateBegin},${releaseDateEnd}`);
    }
    const filterString = filters.length > 0 ? `&${filters.join('&')}` : '';
    this.sharedService.triggerFilterClick(filterString);
  }

  resetForm(): void{
    this.filterForm.reset();
  }

  resetFilter(): void{
    this.filterForm.reset();
    this.sharedService.triggerFilterClick('');
  }

  toggleSidebar(): void {
    this.extended = !this.extended;
  }
}
