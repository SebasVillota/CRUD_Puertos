import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocationService } from './services/location.service';
import { Location } from './models/location.model';
import { AddLocationDialogComponent } from './add-location-dialog/add-location-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  locations: Location[] = [];
  displayedColumns: string[] = ['select', 'type', 'country', 'city', 'name', 'actions'];
  selection = new SelectionModel<Location>(true, []);
  dataSource: MatTableDataSource<Location>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  filterType: string = 'todos';
  filterText: string = '';

  constructor(
    private locationService: LocationService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.locationService.getLocations().subscribe(locations => {
      this.dataSource.data = locations;
      this.selection.clear();
      this.dataSource.filterPredicate = this.createFilter();
    });
  }

  createFilter(): (data: Location, filter: string) => boolean {
    let filterFunction = function(data: Location, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      
      // Filtro exacto para el tipo
      let matchesType = searchTerms.type === '' || data.type === searchTerms.type;
      
      // Filtro de texto para los otros campos
      let matchesText = data.name.toLowerCase().includes(searchTerms.text) ||
                        data.country.toLowerCase().includes(searchTerms.text) ||
                        data.city.toLowerCase().includes(searchTerms.text);
      
      return matchesType && matchesText;
    }
    return filterFunction;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  

  applyFilter() {
    let filterValue = {
      type: this.filterType === 'todos' ? '' : this.filterType,
      text: this.filterText.trim().toLowerCase()
    };
    this.dataSource.filter = JSON.stringify(filterValue);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddLocationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.locationService.addLocation(result);
      }
    });
  }

  editLocation(location: Location) {
    const dialogRef = this.dialog.open(AddLocationDialogComponent, {
      data: location
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.locationService.updateLocation(location.id!, result);
      }
    });
  }

  deleteLocation(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { isMultiple: false }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.locationService.deleteLocation(id);
      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  deleteSelected() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { isMultiple: true }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const selectedIds = this.selection.selected.map(location => location.id!);
        this.locationService.deleteMultipleLocations(selectedIds);
        this.selection.clear();
      }
    });
  }
}