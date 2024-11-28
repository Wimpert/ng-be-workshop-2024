import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TMDBMovieModel } from '@ng-be-workshop/models';
import { MovieService } from '../movie.service';
import { MovieListComponent } from '../movie-list/movie-list.component';

@Component({
  selector: 'movie-list-page',
  templateUrl: './movie-list-page.component.html',
  styleUrls: ['./movie-list-page.component.scss'],
  standalone: true,
  imports: [NgIf, MovieListComponent],
})
export class MovieListPageComponent {
  movies: TMDBMovieModel[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private movieService: MovieService
  ) {
    this.activatedRoute.params.subscribe(params => {
      if (params['category']) {
        this.movieService
          .getMovieList(params['category'])
          .subscribe(movies => (this.movies = movies));
      } else {
        this.movieService
          .getMoviesByGenre(params['id'])
          .subscribe(movies => (this.movies = movies));
      }
    });
  }
}
