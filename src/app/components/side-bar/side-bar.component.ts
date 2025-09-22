import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedService } from '../../services/shared.service';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Genre, PlatformDetails } from '../../models/game.model';
import { RawgService } from '../../services/rawg.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-side-bar',
  imports: [MatIconModule, MatTooltipModule, MatCheckboxModule, ReactiveFormsModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  sidebarExtended: boolean = false;
  genresExtended: boolean = false;
  platformsExtended: boolean = false;
  filterForm: FormGroup;
  genres: Genre[] = [];
  platforms: PlatformDetails[] = [];
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
      platforms: this.fb.array<FormControl<boolean | null>>([])
    });
  }

  ngOnInit(): void {
    this.loadGenres();
    this.loadPlatforms();
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

  loadPlatforms(): void {
    this.loading = true;
    this.error = null;
    this.rawgService.getPlatforms().subscribe({
      next: (platforms) => {
        this.platforms = platforms;
        const platformControls = platforms.map(() => new FormControl<boolean | null>(false));
        this.filterForm.setControl('platforms', this.fb.array<FormControl<boolean | null>>(platformControls));
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
  get platformsArray(): FormArray<FormControl<boolean | null>> {
    return this.filterForm.get('platforms') as FormArray<FormControl<boolean | null>>;
  }

  onFilterBtnClick(): void {
    const selectedGenres = this.genres
      .filter((_, index) => this.genresArray.at(index).value)
      .map((genre) => genre.slug);
    const filters = [];
    if (selectedGenres.length > 0) {
      filters.push(`genres=${selectedGenres.join(',')}`);
    }
    const selectedPlatforms = this.platforms
      .filter((_, index) => this.platformsArray.at(index).value)
      .map((platform) => platform.id);
    if (selectedPlatforms.length > 0) {
      filters.push(`platforms=${selectedPlatforms.join(',')}`);
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
    this.sidebarExtended = !this.sidebarExtended;
    this.genresExtended = false
    this.platformsExtended = false
  }

  toggleGenres(): void {
    this.genresExtended = !this.genresExtended;
  }

  togglePlatforms(): void {
    this.platformsExtended = !this.platformsExtended
  }


}
