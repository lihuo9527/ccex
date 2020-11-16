import { NgModule } from '@angular/core';
import { TruncateToPrecisionPipe } from './truncate-as-number-to-precision.pipe';
import { TruncateAsStringToPrecisionPipe } from './truncate-as-string-to-precision.pipe';
@NgModule({
    declarations: [
        TruncateToPrecisionPipe,
        TruncateAsStringToPrecisionPipe,
    ],
    imports: [],
    exports: [
        TruncateToPrecisionPipe,
        TruncateAsStringToPrecisionPipe,
    ]
})
export class PipesModule { }