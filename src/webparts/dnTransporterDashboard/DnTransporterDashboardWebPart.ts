import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DnTransporterDashboardWebPartStrings';
import DnTransporterDashboard from './components/DnTransporterDashboard';
import { IDnTransporterDashboardProps } from './components/IDnTransporterDashboardProps';

export interface IDnTransporterDashboardWebPartProps {
  description: string;
}

export default class DnTransporterDashboardWebPart extends BaseClientSideWebPart<IDnTransporterDashboardWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IDnTransporterDashboardProps> = React.createElement(
      DnTransporterDashboard,
      {
        description: this.properties.description,
        context: this.context,
        siteurl: this.context.pageContext.web.absoluteUrl,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get data(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
